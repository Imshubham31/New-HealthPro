import { AppointmentFormState } from './states/appointment-form.state';
import { ModalControls } from '../../../lib/shared/components/modal/modal.service';
import { LocaliseService } from '../../../lib/localise/localise.service';
import { Hcp } from '../../hcp/hcp.model';
import { RestrictProcessingPipe } from '../../../lib/shared/services/restricted-user.pipe';
import {
    Component,
    ViewChild,
    OnInit,
    HostListener,
    ElementRef,
} from '@angular/core';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { PatientService } from '../../patients/patient.service';
import { AppointmentsService } from '../appointments.service';
import { AppointmentFormHintsGenerator } from './appointment-form-hints-generator';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { PatientOverview } from '../../patients/view-patient.model';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ParticipantType } from '@lib/participants/participants.service';
import { AppointmentService } from 'app/template/appointment.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Router } from '@angular/router';
@Component({
    selector: 'appointment-form',
    templateUrl: './appointment-form.component.html',
    styles: [
        `
            p {
                padding-inline-start: 0.5rem;
                line-height: 1.75rem;
            }
            a.customdropdown {
                position: absolute;
                top: -32px;
                left: 533px;
                border: 0;
                padding: 0px;
                height: 0;
                margin-top: 5px;
            }
            ul.listblcok {
                display: block;
                width: 553px;
                margin-top: -10px;
            }
            li.listitem {
                padding: 5px;
            }
            .arrow-box {
                border: 3px solid white;
                min-width: unset;
            }
            .arrow-box:after,
            .arrow-box:before {
                bottom: 100%;
                left: 85%;
                border: solid transparent;
                content: ' ';
                position: absolute;
            }
            .font-gray {
                color: #9a9c9ed6;
                background-color: #bbb7b730;
            }
            .padding-right-5 {
                padding-right: 5px;
            }
            .custom-dropdown {
                position: relative;
                width: 100%;
            }
            .custom-dropdown ul:before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                margin-left: -1.5em;
                top: -2px;
                left: 100%;
                box-sizing: border-box;
                border: 0.5em solid black;
                border-color: transparent transparent;
                transform-origin: 0 0;
                transform: rotate(-45deg);
                box-shadow: 1px -1px 1px 0 rgba(148, 146, 146, 0.4);
            }
        `,
    ],
    providers: [AppointmentFormHintsGenerator, AppointmentService],
})
export class AppointmentFormComponent extends BaseForm
    implements ModalControls, OnInit {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    minDate = new Date();
    HCPs: ParticipantDetails[] = [];
    patients: ParticipantDetails[] = [];
    selectedPatient: PatientOverview;
    state: AppointmentFormState;
    participantType = ParticipantType.Patient;
    appointmentTemplates;
    titleHeader;
    showTitleWidget = false;
    isDropDownOpen = false;
    authenticationService = AuthenticationService;
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.eRef.nativeElement.contains(event.target)) {
            if (this.isDropDownOpen) {
                this.showTitleWidget = false;
                this.isDropDownOpen = false;
            }
        }
    }

    get errors$() {
        return this.service.getAppointments$().pipe(map(state => state.errors));
    }

    get hints() {
        return this.hintsFactory.getHints(this.form);
    }

    get hcpLabelFormatter() {
        // We must instantiate the RestrictProcessingPipe like this to avoid scoping issues on modal tag input
        return (hcp: Hcp) =>
            new RestrictProcessingPipe(this.localiseService).transform(hcp);
    }

    constructor(
        public service: AppointmentsService,
        private patientService: PatientService,
        private hintsFactory: AppointmentFormHintsGenerator,
        private localiseService: LocaliseService,
        private appointmentService: AppointmentService,
        private eRef: ElementRef,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        this.enableLocationUrl();
    }

    open() {
        this.service.resetErrors();
        this.modal.openModal();
    }

    close() {
        super.cleanForm();
        this.modal.closeModal();
        this.service.resetErrors();
        this.reloadComponent();
    }

    submit() {
        this.submitting = true;
        super.submit();
        this.state
            .submit()
            .subscribe(() => this.close(), () => (this.submitting = false));
    }

    setupPatientDetails(participant: ParticipantDetails) {
        this.onPatientParticipantSelect(participant).subscribe();
    }

    handlePatientChange(participant: ParticipantDetails) {
        this.HCPs = [];
        this.form.get('HCPs').enable();
        this.form.get('HCPs').setValue([]);
        this.form.get('title').setValue(null);
        this.form.get('location').setValue(null);
        this.form.get('description').setValue(null);
        return this.onPatientParticipantSelect(participant).subscribe();
    }

    private onPatientParticipantSelect(participant: ParticipantDetails) {
        return this.patientService.getPatient$(participant.backendId).pipe(
            catchError(() =>
                this.handlePatientNotFoundError(participant.backendId),
            ),
            tap(patient => {
                this.setHcps(patient);
                this.selectedPatient = patient;
                this.titleHeader = patient.careModule
                    ? patient.careModule.title
                    : '';
                if (this.HCPs && this.HCPs.length > 0) {
                    this.form.get('HCPs').enable();
                }
            }),
        );
    }

    private handlePatientNotFoundError(backendId: string) {
        return this.patientService
            .fetchPatientWithId(backendId)
            .pipe(switchMap(() => this.patientService.getPatient$(backendId)));
    }

    patientLabelFormatter(patient: ParticipantDetails): string {
        return `${patient.firstName.trim()} ${patient.lastName.trim()}`;
    }
    reloadComponent() {
        // Bit of a hack but the only way I can trigger a reload. We need it to update the view after language change
        this.router
            .navigateByUrl('/', {
                skipLocationChange: true,
            })
            .then(() => this.router.navigate(['/appointments']));
    }
    setHcps(patient?: PatientOverview) {
        if (!patient) {
            this.HCPs = [];
            return;
        }
        this.HCPs = this.getMDTsHcps(patient);
    }

    getMDTsHcps(patient: PatientOverview) {
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

    getUniqueListBy(arr: any) {
        const uniqIds = {};
        return arr.filter(
            obj => !uniqIds[obj.idmsId] && (uniqIds[obj.idmsId] = true),
        );
    }

    enableLocationUrl() {
        this.form.get('includeLinkToLocation').valueChanges.subscribe(value => {
            value
                ? this.form.get('locationUrl').enable()
                : this.form.get('locationUrl').disable();
        });
    }

    getAppointmentsTemplate(event) {
        if (this.selectedPatient) {
            this.appointmentService
                .getAppointmentTemplate()
                .subscribe((data: any) => {
                    this.appointmentTemplates = data.filter(
                        appointemnt =>
                            appointemnt.caremoduleId ===
                            this.selectedPatient.careModule.id,
                    );
                    this.appointmentTemplates.sort(function(a, b) {
                        const titleNameA = a.title.toLowerCase();
                        const titleNameB = b.title.toLowerCase();
                        if (titleNameA < titleNameB) {
                            return -1;
                        }
                        if (titleNameA > titleNameB) {
                            return 1;
                        }
                        return 0;
                    });
                });
            event.stopPropagation();
            this.showTitleWidget = !this.showTitleWidget;
            this.isDropDownOpen = true;
        }
    }

    getTitle(appointemnt, event) {
        this.form.get('title').setValue(appointemnt.title);
        this.form.get('description').setValue(appointemnt.description);
        this.form.get('location').setValue(appointemnt.location);
        this.showTitleWidget = false;
        event.stopPropagation();
    }

    resetTemplate(event) {
        event.stopPropagation();
        this.showTitleWidget = false;
    }
}
