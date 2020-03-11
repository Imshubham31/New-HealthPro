import { Injectable } from '@angular/core';

import { Appointment } from '@lib/appointments/appointment.model';
import { Location } from '@lib/appointments/location';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateRange } from '@lib/appointments/date-range';
import { ModalControlsValidators } from '@lib/shared/components/modal/validators';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';

@Injectable()
export class AppointmentFormModelFactory {
    static createFormGroupFromAppointment(
        appointment = new Appointment(),
    ): FormGroup {
        const workingHours = new DateRange(new Date(), new Date());
        workingHours.start.setHours(7, 0, 0, 0);
        workingHours.end.setHours(23, 59, 0, 0);

        return new FormBuilder().group({
            id: appointment.id,
            title: [appointment.title, { readonly: true }, Validators.required],
            date: [appointment.date, Validators.required],
            timeSpan: [
                appointment.timeSlot,
                [
                    Validators.required,
                    ModalControlsValidators.timeRangeInFuture,
                    ModalControlsValidators.timeRangeBetween(workingHours),
                ],
            ],
            patient: [appointment.patientDetails, Validators.required],
            HCPs: [appointment.watcherDetails, Validators.required],
            location: [appointment.location.name, Validators.required],
            locationUrl: [{ value: appointment.location.url, disabled: true }],
            includeLinkToLocation: Boolean(appointment.location.url),
            description: [appointment.description, Validators.required],
        });
    }

    static formGroupToAppointment(form: FormGroup): Appointment {
        const value = form.getRawValue();

        const appointment = new Appointment(
            value.title,
            value.description,
            AppointmentStatus.pending,
            value.timeSpan,
            value.HCPs,
            value.patient,
            new Location(value.location, value.locationUrl),
            value.patient.id,
            new Date(),
            false, // TODO: Need a better way of constructing this appointment. isIntegrated must be false creating on a client
            true,
            value.id,
        );

        return appointment;
    }
}
