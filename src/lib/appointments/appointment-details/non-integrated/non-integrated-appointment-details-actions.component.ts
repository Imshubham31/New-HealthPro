import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Appointment } from '../../appointment.model';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { AppointmentsService } from 'app/appointments/appointments.service';
import { ConfirmationDialogComponent } from '@lib/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppointmentFormFactory } from 'app/appointments/appointment-form/factories/appointment-form.factory';

@Component({
    template: `
        <div *ngIf="canEdit" class="button-container">
            <button
                class="btn btn-link link edit"
                (click)="openEdit(appointment)"
            >
                {{ 'edit' | localise }}
            </button>
            <button
                class="btn btn-link delete underline"
                (click)="openDelete()"
            >
                {{ 'delete' | localise }}
            </button>
        </div>
    `,
    styleUrls: ['../appointment-details-actions.component.scss'],
})
export class NonIntegratedAppointmentDetailsActionsComponent {
    @Input() appointment: Appointment;
    @Output() onDelete = new EventEmitter();
    get canEdit() {
        return this.appointment.timeSlot.start.getTime() >= Date.now();
    }

    constructor(
        private modalService: ModalService,
        public appointmentFactory: AppointmentFormFactory,
        private localise: LocaliseService,
        private appointmentService: AppointmentsService,
    ) {}

    openEdit(appointment: Appointment) {
        this.appointmentFactory.makeUpdateForm(appointment).open();
    }

    openDelete() {
        const comp = this.modalService.create<ConfirmationDialogComponent>(
            ConfirmationDialogComponent,
        );
        comp.heading = this.localise.fromKey('confirmAppointmentDelete');
        comp.onClose.subscribe(result => {
            if (result) {
                this.appointmentService
                    .deleteAppointment(this.appointment)
                    .subscribe(() => {
                        this.onDelete.next(result);
                    });
            }
        });
        comp.open();
    }
}
