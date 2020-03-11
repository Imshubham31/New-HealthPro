import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from '@lib/appointments/appointment.model';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { AppointmentsService } from '../appointments.service';

@Component({
    selector: 'appointment-details-page',
    templateUrl: './appointment-details-page.component.html',
    styleUrls: ['./appointment-details-page.component.scss'],
})
export class AppointmentDetailsPageComponent implements OnInit {
    appointment: Appointment;
    isDeleting = false;
    showConfirmation = false;
    private appointmentId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private service: AppointmentsService,
    ) {}

    ngOnInit() {
        AppCoordinator.loadingOverlay.next({ loading: true });
        this.route.paramMap.subscribe(params => {
            this.appointmentId = params.get('id');
            this.service.fetchAppointment(this.appointmentId).subscribe();
        });

        this.service.getAppointments$().subscribe(appointments => {
            AppCoordinator.loadingOverlay.next({
                loading: appointments.isFetching,
            });
            this.appointment = appointments.list.find(
                appointment => appointment.id === this.appointmentId,
            );
        });
    }

    handleDelete() {
        this.router.navigateByUrl('/appointments');
    }
}
