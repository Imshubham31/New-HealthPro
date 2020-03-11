import { finalize, map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { AppointmentApi } from '@lib/appointments/appointments-rest.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { PatientsRestService } from '../patients-rest.service';
import { PatientOverview } from '../view-patient.model';
import { Pathway } from '@lib/pathway/pathway.model';
import { HcpMessagesService } from 'app/messages/messages.service';
import { Router } from '@angular/router';
import { StartNewConversationComponent } from '../../../lib/messages/start-new-conversation/start-new-conversation.component';
import { ModalService } from '../../../lib/shared/components/modal/modal.service';
import { Patient } from 'app/patients/patient.model';
@Component({
    selector: 'patient-registration',
    templateUrl: './patient-registration.component.html',
    styleUrls: ['./patient-registration.component.scss'],
})
@Unsubscribe()
export class PatientRegistrationComponent implements OnInit {
    @Input() pathway: Pathway;
    @Input() patientOverviewData: PatientOverview;
    @Input() startNewConversation = false;
    noOfUnreadMessage = 0;
    loadingAppointment: boolean;
    loadingMessages: boolean;
    appointment: AppointmentApi;
    subscriptions: Subscription[] = [];
    patientDetails;
    public startConversationModal: StartNewConversationComponent;
    constructor(
        private patientRestService: PatientsRestService,
        private messagesService: HcpMessagesService,
        private router: Router,
        public modalService: ModalService,
    ) {}

    ngOnInit(): void {
        this.getLatestAppointment();
        this.patientMessages();
        this.patientDetails = this.patientOverviewData.patient;
    }

    patientMessages() {
        this.subscriptions.push(
            this.messagesService
                .loadMessagesFromUser(
                    this.patientOverviewData.patient.backendId,
                )
                .subscribe(next => {
                    this.noOfUnreadMessage = next.reduce(
                        (unreadMessages, chat) =>
                            unreadMessages + chat.unreadMessages,
                        0,
                    );
                }),
            this.messagesService.store$.subscribe(state => {
                this.loadingMessages = state.isFetching;
            }),
        );
    }

    getLatestAppointment() {
        this.loadingAppointment = true;
        const displayStatuses = [
            AppointmentStatus[AppointmentStatus.accepted],
            AppointmentStatus[AppointmentStatus.scheduled],
            AppointmentStatus[AppointmentStatus.updated],
            AppointmentStatus[AppointmentStatus.attended],
            AppointmentStatus[AppointmentStatus.missed],
        ];
        this.subscriptions.push(
            // TODO: We should be using the appointment service to find appointments
            this.patientRestService
                .getAppointments(this.patientOverviewData.patient.backendId)
                .pipe(
                    map(appointments =>
                        appointments
                            .sort((a, b) => a.startDateTime - b.startDateTime)
                            .find(
                                n =>
                                    n.startDateTime * 1000 > Date.now() &&
                                    displayStatuses.includes(n.status),
                            ),
                    ),
                    finalize(() => (this.loadingAppointment = false)),
                )
                .subscribe(appointment => (this.appointment = appointment)),
        );
    }

    openMessages() {
        this.router.navigate(['/messages'], {
            queryParams: {
                patientId: this.patientOverviewData.patient.backendId,
            },
        });
    }

    showNewMessageModal(patient: Patient) {
        this.startConversationModal = this.modalService.create<
            StartNewConversationComponent
        >(StartNewConversationComponent, { disableRadiogroup: true });
        this.startConversationModal.startWithPatient(patient);
    }
}
