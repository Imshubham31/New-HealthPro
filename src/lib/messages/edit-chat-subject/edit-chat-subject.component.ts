import { Router } from '@angular/router';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ParticipantType } from '@lib/participants/participants.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { MessagesService } from '@lib/messages/messages.service';
import { Chat } from '@lib/messages/chat.model';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { RestrictProcessingPipe } from '../../../lib/shared/services/restricted-user.pipe';
import { Hcp } from 'app/hcp/hcp.model';
import { PatientOverview } from 'app/patients/view-patient.model';
import { PatientService } from 'app/patients/patient.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { of, forkJoin, Observable } from 'rxjs';
import { ArrayUtils } from '@lib/utils/array-utils';
@Component({
    templateUrl: './edit-chat-subject.component.html',
    styles: [
        `
            .inputAlignment {
                padding-left: 0px !important;
            }
        `,
    ],
})
export class EditChatSubjectComponent extends BaseForm
    implements SetsUpForm, ModalControls {
    chat: Chat;
    HCPs: ParticipantDetails[] = [];
    patient: ParticipantDetails = null;
    hcpParticipantType = ParticipantType.HCP;
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Output() onRemove = new EventEmitter();
    constructor(
        private fb: FormBuilder,
        private localiseService: LocaliseService,
        private messagesService: MessagesService,
        private toastService: ToastService,
        private patientService: PatientService,
        private router: Router,
    ) {
        super();
    }

    open() {
        this.modal.openModal();
    }

    close() {
        this.cleanForm();
        this.modal.closeModal();
    }

    setupForm(): void {
        this.form = this.fb.group({
            subject: ['', [Validators.required]],
            hcpParticipant: ['', Validators.minLength(this.patient ? 1 : 2)],
            participant: [''],
        });
    }

    shouldDisableSubmit() {
        return !this.form.valid;
    }

    start(chat: Chat) {
        this.chat = chat;
        const participantsDetails = chat.participantDetails;
        const hcpParticipants = participantsDetails.filter(
            (participant: ParticipantDetails) => {
                return !participant.backendId.includes(ParticipantType.Patient);
            },
        );
        this.patient = participantsDetails.find(
            (participant: ParticipantDetails) => {
                return participant.backendId.includes(ParticipantType.Patient);
            },
        );
        this.setupForm();
        this.form.get('subject').setValue(chat.subject);
        this.form.get('hcpParticipant').setValue(hcpParticipants);
        if (this.patient) {
            this.form.get('participant').disable();
            this.form.get('participant').setValue(this.patient.displayName);
            this.onPatientParticipantSelect(this.patient).subscribe();
        }
        this.open();
    }

    get hcpLabelFormatter() {
        // We must instantiate the RestrictProcessingPipe like this to avoid scoping issues on modal tag input
        return (hcp: Hcp) =>
            new RestrictProcessingPipe(this.localiseService).transform(hcp);
    }

    get hcpRoleLabel() {
        return (hcp: Hcp) => hcp.role;
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        super.submit();
        const currentHcp = AuthenticationService.getUser().backendId;
        const newSubject = this.form.get('subject').value;
        const newParticipants = this.form.get('hcpParticipant').value;
        if (this.patient) {
            newParticipants.push(this.patient);
        }
        this.submitting = true;
        const editSubject$ =
            this.chat.subject !== newSubject
                ? this.messagesService.editSubject(this.chat, newSubject)
                : of(0);
        const editParticipants$ = this.participantsChanged(newParticipants)
            ? this.messagesService.editParticipants(this.chat, newParticipants)
            : of(0);
        forkJoin(
            this.catchErr(editSubject$),
            this.catchErr(editParticipants$),
        ).subscribe(() => {
            if (
                !newParticipants.some(
                    (p: ParticipantDetails) => p.backendId === currentHcp,
                )
            ) {
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('chatSelfRemove'),
                    ToastStyles.Success,
                );
                this.reloadComponent();
            } else {
                this.messagesService.refetchOne(this.chat.id);
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('chatUpdated'),
                    ToastStyles.Success,
                );
            }
            this.complete();
        });
    }
    private catchErr(obs: Observable<any>): Observable<any> {
        return obs.pipe(
            catchError(err => {
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('chatNotUpdated'),
                    ToastStyles.Error,
                );
                return err;
            }),
        );
    }

    private participantsChanged(participants: ParticipantDetails[]): boolean {
        const map = ArrayUtils.toMap(participants, p => p.backendId);
        return (
            this.chat.participantDetails.some(
                (pd: ParticipantDetails) => !map.delete(pd.backendId),
            ) || map.size !== 0
        );
    }

    complete() {
        this.submitting = false;
        this.close();
    }

    private reloadComponent() {
        // Bit of a hack but the only way I can trigger a reload. We need it to update the view after language change
        this.router
            .navigateByUrl('/', {
                skipLocationChange: true,
            })
            .then(() =>
                this.router.navigate([
                    '/messages',
                    { outlets: { master: 'all' } },
                ]),
            );
        this.onRemove.emit();
    }

    getTitle(): string {
        return this.localiseService.fromKey('editMessageDetails');
    }

    private onPatientParticipantSelect(participant: ParticipantDetails) {
        return this.patientService.getPatient$(participant.backendId).pipe(
            catchError(() =>
                this.handlePatientNotFoundError(participant.backendId),
            ),
            tap(patientdetails => {
                this.setHcps(patientdetails);
            }),
        );
    }

    private handlePatientNotFoundError(backendId: string) {
        return this.patientService
            .fetchPatientWithId(backendId)
            .pipe(switchMap(() => this.patientService.getPatient$(backendId)));
    }

    getUniqueListBy(arr: any) {
        const uniqIds = {};
        return arr.filter(
            obj => !uniqIds[obj.idmsId] && (uniqIds[obj.idmsId] = true),
        );
    }

    private setHcps(patient?: PatientOverview) {
        if (!patient) {
            this.HCPs = [];
            return;
        }
        this.HCPs = this.getMDTsHcps(patient);
    }

    private getMDTsHcps(patient: PatientOverview) {
        const hcps = [];
        patient.patient.mdts.forEach(mdt => {
            const result: ParticipantDetails[] = mdt.hcps
                .filter(hcp => !Boolean(hcp.isRestricted))
                .map(hcp => ParticipantDetails.map(hcp));
            result.forEach(element => {
                hcps.push(element);
            });
        });
        return this.getUniqueListBy(hcps);
    }
}
