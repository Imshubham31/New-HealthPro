import { BaseForm } from '@lib/shared/services/base-form';
import { AppointmentFormComponent } from '../appointment-form.component';
import { AppointmentFormState } from './appointment-form.state';
import { AppointmentFormModelFactory } from '../factories/appointment-form-model.factory';
export class UpdateAppointmentState implements AppointmentFormState {
    readonly titleTextKey = 'updateAppointment';
    readonly submitButtonTextKey = 'updateAppointmentButton';
    constructor(readonly context: AppointmentFormComponent & BaseForm) {}
    submit() {
        const appointment = AppointmentFormModelFactory.formGroupToAppointment(
            this.context.form,
        );
        return this.context.service.saveAppointment(appointment, false);
    }
}
