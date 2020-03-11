import {
    Component,
    ViewChild,
    HostListener,
    ElementRef,
    EventEmitter,
    Output,
    Input,
    OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { BaseForm } from '@lib/shared/services/base-form';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { Hcp } from 'app/hcp/hcp.model';
import { RestrictProcessingPipe } from '../../../lib/shared/services/restricted-user.pipe';
import { MessagesService } from '../messages.service';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { PatientService } from 'app/patients/patient.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PatientOverview } from 'app/patients/view-patient.model';
import { MessageService } from 'app/template/message.service';
import { ParticipantType } from '@lib/participants/participants.service';
import { Patient } from 'app/patients/patient.model';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';
import { Router } from '@angular/router';
@Component({
    templateUrl: './start-new-conversation.component.html',
    styleUrls: ['./start-new-conversation.component.scss'],
    providers: [MessageService],
})
@Unsubscribe()
export class StartNewConversationComponent extends BaseForm
    implements ModalControls, OnInit {
    subscriptions: Subscription[] = [];

    @ViewChild(ModalWrapperComponent, { static: true })
    modal: ModalWrapperComponent;
    participants: User[] = [];
    body: string;
    participantType = ParticipantType.Patient;
    readonly maxbodyLength = 240;
    subject: string;
    selectedPatient: PatientOverview;
    messageTemplates;
    titleHeader;
    showTitleWidget = false;
    isDropDownOpen = false;
    participantId;
    isCreateNewMessageComponet = false;
    isCareCordinator: boolean;
    relatingPatient = true;
    HCPs: ParticipantDetails[] = [];
    hcpId;
    @Input() disableRadiogroup = false;
    @Output() msgSuccess = new EventEmitter();
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.eRef.nativeElement.contains(event.target)) {
            if (this.isDropDownOpen) {
                this.showTitleWidget = false;
                this.isDropDownOpen = false;
            }
        }
    }
    constructor(
        private fb: FormBuilder,
        private localiseService: LocaliseService,
        private messagesService: MessagesService,
        private toastService: ToastService,
        private patientService: PatientService,
        private messageService: MessageService,
        private router: Router,
        private eRef: ElementRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.isIncludingPatient(true);
    }

    isIncludingPatient(includePatient: boolean): void {
        if (this.relatingPatient === includePatient) {
            return;
        }
        this.relatingPatient = includePatient;
        this.form.reset();
        this.participantId = null;
        if (this.relatingPatient) {
            this.participantType = ParticipantType.Patient;
            this.form.get('patient').enable();
            this.form.get('hcpParticipant').enable();
            this.form.get('hcpOnlyParticipants').disable();
        } else {
            this.participantType = ParticipantType.HCP;
            this.form.get('patient').disable();
            this.form.get('hcpParticipant').disable();
            this.form.get('hcpOnlyParticipants').enable();
            this.form
                .get('hcpOnlyParticipants')
                .setValue([
                    ParticipantDetails.map(AuthenticationService.getUser()),
                ]);
        }
    }

    open() {
        this.setupForm();
        this.form.reset();
        this.modal.openModal();
    }

    close() {
        this.submitting = false;
        super.cleanForm();
        this.modal.closeModal();
    }

    setupForm(): void {
        this.form = this.fb.group({
            subject: [
                '',
                [
                    Validators.required,
                    NoWhitespaceValidator(),
                    Validators.maxLength(48),
                ],
            ],
            patient: ['', Validators.required],
            hcpParticipant: ['', Validators.required],
            hcpOnlyParticipants: ['', Validators.minLength(2)],
            body: [
                '',
                [
                    Validators.required,
                    NoWhitespaceValidator(),
                    Validators.maxLength(this.maxbodyLength),
                ],
            ],
        });
    }
    startWithPatient(patient: Patient) {
        const participant = ParticipantDetails.map(patient);
        this.setupForm();
        this.form.reset();
        this.form.get('patient').disable();
        this.form.get('patient').setValue(participant);
        this.modal.openModal();
        this.handlePatientChange(participant);
    }
    startWithHcp(_hcp: Hcp) {
        this.setupForm();
        this.form.reset();
        this.form.get('patient').disable();
        this.modal.openModal();
    }

    private get selectedParticipants(): any[] {
        if (this.relatingPatient) {
            return [
                ...this.form.get('hcpParticipant').value,
                this.participantId,
            ];
        }
        return [...this.form.get('hcpOnlyParticipants').value];
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        super.submit();
        this.submitting = true;
        this.subject = this.form.get('subject').value;
        this.body = this.form.get('body').value;
        const user = AuthenticationService.getUser();
        this.subscriptions.push(
            this.messagesService
                .create({
                    senderId: user.backendId,
                    subject: this.subject,
                    body: this.body,
                    participants: this.selectedParticipants,
                })
                .subscribe(
                    (created: RESTSuccess) => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('messageCreated'),
                            ToastStyles.Success,
                        );
                        this.router.navigate([
                            '/messages',
                            {
                                outlets: {
                                    master: 'all',
                                    detail: created.chatId.toString(),
                                },
                            },
                        ]);
                        this.close();
                        this.msgSuccess.emit();
                    },
                    () => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('messageNotCreated'),
                            ToastStyles.Error,
                        );
                    },
                ),
        );
    }

    getTitle(): string {
        return this.localiseService.fromKey('startANewConversation');
    }

    // TODO: This component needs a refactor
    get bodyLength() {
        if (!this.form) {
            return '';
        }
        return this.form.value.body || '';
    }

    handlePatientChange(participantId?) {
        this.form.get('patient').setValue(participantId);
        this.form.get('hcpParticipant').setValue(null);
        this.form.get('subject').setValue(null);
        this.form.get('body').setValue(null);
        this.participantId = participantId;
        this.subscriptions.push(
            this.onPatientParticipantSelect(participantId).subscribe(),
        );
    }

    private onPatientParticipantSelect(participant: ParticipantDetails) {
        return this.patientService.getPatient$(participant.backendId).pipe(
            catchError(() =>
                this.handlePatientNotFoundError(participant.backendId),
            ),
            tap(patient => {
                this.setHcps(patient);
                this.form
                    .get('hcpParticipant')
                    .setValue(this.HCPs.filter(this.isAuthenticatedUser));
                this.selectedPatient = patient;
                this.titleHeader = this.selectedPatient.careModule
                    ? this.selectedPatient.careModule.title
                    : '';
                this.isCareCordinator = AuthenticationService.isCareCoordinator();
            }),
        );
    }

    private handlePatientNotFoundError(backendId: string) {
        return this.patientService
            .fetchPatientWithId(backendId)
            .pipe(switchMap(() => this.patientService.getPatient$(backendId)));
    }

    getMessagesTemplate(event) {
        if (this.selectedPatient) {
            this.subscriptions.push(
                this.messageService
                    .getMessageTemplate()
                    .subscribe((data: any) => {
                        if (
                            !this.selectedPatient.careModule ||
                            !this.selectedPatient.careModule.id
                        ) {
                            return;
                        }
                        this.messageTemplates = data.filter(
                            appointemnt =>
                                appointemnt.caremoduleId ===
                                this.selectedPatient.careModule.id,
                        );
                        this.messageTemplates.sort(function(a, b) {
                            const messageA = a.subject.toLowerCase();
                            const messageB = b.subject.toLowerCase();
                            if (messageA < messageB) {
                                return -1;
                            }
                            if (messageA > messageB) {
                                return 1;
                            }
                            return 0;
                        });
                    }),
            );
            event.stopPropagation();
            this.showTitleWidget = !this.showTitleWidget;
            this.isDropDownOpen = true;
        }
    }

    getMessage(messages, event) {
        this.form.get('subject').setValue(messages.subject);
        this.form.get('body').setValue(messages.message);
        this.showTitleWidget = false;
        event.stopPropagation();
    }

    get hcpLabelFormatter() {
        // We must instantiate the RestrictProcessingPipe like this to avoid scoping issues on modal tag input
        return (hcp: ParticipantDetails) =>
            new RestrictProcessingPipe(this.localiseService).transform(hcp);
    }

    get hcpRoleLabel() {
        return (hcp: ParticipantDetails) => hcp.role;
    }

    get isAuthenticatedUser() {
        return (hcp: ParticipantDetails) =>
            hcp.backendId === AuthenticationService.getUser().backendId;
    }

    get wrappedPatient(): any[] {
        return this.participantId ? [this.participantId.displayName] : [];
    }

    private setHcps(patient?: PatientOverview) {
        if (!patient) {
            this.HCPs = [];
            return;
        }
        this.HCPs = this.getHcpsFromMdts(patient);
    }

    private getHcpsFromMdts(patient: PatientOverview): ParticipantDetails[] {
        const hcps = [];
        const uniqIds = {};
        patient.patient.mdts.forEach(mdt => {
            mdt.hcps
                .filter(hcp => !Boolean(hcp.isRestricted))
                .map(hcp => ParticipantDetails.map(hcp))
                .forEach(participant => {
                    if (!uniqIds[participant.idmsId]) {
                        uniqIds[participant.idmsId] = true;
                        hcps.push(participant);
                    }
                });
        });
        return hcps;
    }
}
