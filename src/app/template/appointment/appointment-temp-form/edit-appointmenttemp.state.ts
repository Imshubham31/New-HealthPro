import { of } from 'rxjs';

import { finalize, catchError, tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';

import {
    AppoinmtneTempFormState,
    AppointmentTempFormContext,
} from './appointmenttemp-form.d';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { AppointmentTemplate } from './../../appointmenttemplate.model';
import { LocaliseService } from '@lib/localise/localise.service';
export class EditAppointmentTempState implements AppoinmtneTempFormState {
    context: AppointmentTempFormContext;
    constructor(private localise: LocaliseService) {}
    get title() {
        return this.localise.fromKey('editNewPrefillTemplate');
    }

    get subTitle() {
        return this.localise.fromKey('forAppointments');
    }

    get submitButtonText() {
        return this.localise.fromKey('saveChanges');
    }

    submit() {
        this.context.submit();
        this.context.submitting = true;
        this.context.errors = [];
        this.context.appointmentService
            .updateAppointmentTemplate(
                this.context.appointmentTemplate.id,
                this.buildAppointment(),
            )
            .pipe(
                tap(() => {
                    this.context.onSuccess.next();
                    this.context.finish();
                }),
                catchError(error => {
                    this.context.errors = [error.error];
                    return of(error);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    setupForm(): void {
        const controls = {
            caremoduleId: [
                this.context.appointmentTemplate.caremoduleId,
                [Validators.required],
            ],
            title: [
                this.context.appointmentTemplate.title,
                [Validators.required, NoWhitespaceValidator()],
            ],
            description: [this.context.appointmentTemplate.description, []],
            location: [this.context.appointmentTemplate.location, []],
        };

        this.context.form = this.context.fb.group(controls);
    }

    private buildAppointment() {
        const editedAppointmetTemp: AppointmentTemplate = new AppointmentTemplate();
        const formModel = this.context.form.value;
        editedAppointmetTemp.caremoduleId = formModel.caremoduleId;
        editedAppointmetTemp.title = formModel.title;
        editedAppointmetTemp.name = this.context.appointmentTemplate.name;
        editedAppointmetTemp.description = formModel.description;
        editedAppointmetTemp.location = formModel.location;
        return editedAppointmetTemp;
    }
}
