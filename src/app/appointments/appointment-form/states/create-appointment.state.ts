import { BaseForm } from '@lib/shared/services/base-form';
import { AppointmentFormComponent } from '../appointment-form.component';
import { AppointmentFormState } from './appointment-form.state';
import { AppointmentFormModelFactory } from '../factories/appointment-form-model.factory';
export class CreateAppointmentState implements AppointmentFormState {
    readonly titleTextKey = 'newAppointment';
    readonly submitButtonTextKey = 'createAppointmentButton';
    constructor(readonly context: AppointmentFormComponent & BaseForm) {}
    submit() {
        const appointment = AppointmentFormModelFactory.formGroupToAppointment(
            this.context.form,
        );

        return this.context.service.saveAppointment(appointment, true);
    }
}
