import { of } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import {
    AppoinmtneTempFormState,
    AppointmentTempFormContext,
} from './appointmenttemp-form.d';
import { Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { AppointmentTemplate } from './../../appointmenttemplate.model';
import { LocaliseService } from '@lib/localise/localise.service';

export class CreateAppointmentTempState implements AppoinmtneTempFormState {
    context: AppointmentTempFormContext;
    constructor(private localise: LocaliseService) {}
    get title() {
        return this.localise.fromKey('addNewPrefillTemplate');
    }

    get subTitle() {
        return this.localise.fromKey('forAppointments');
    }

    get submitButtonText() {
        return this.localise.fromKey('addTemplateToList');
    }

    submit(): void {
        this.context.appointmentService.newAppointmentTemp = null;
        this.context.submit();
        this.context.errors = [];
        this.context.submitting = true;
        this.context.appointmentTemplate = this.buildAppointmentTemp();
        this.context.appointmentService
            .createAppointmentTemplate(this.buildAppointmentTemp())
            .pipe(
                tap(success => {
                    this.context.appointmentTemplate.id = success.resourceId.toString();
                    this.context.appointmentService.newAppointmentTemp = this.context.appointmentTemplate;
                    this.context.onSuccess.next();
                    this.context.finish();
                }),
                catchError(err => {
                    this.context.errors.push(err.error);
                    return of(err);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    protected buildControls() {
        const controls = {
            caremoduleId: ['', [Validators.required]],
            title: ['', [Validators.required, NoWhitespaceValidator()]],
            description: [''],
            location: [''],
        };

        return controls;
    }

    setupForm(): void {
        this.context.form = this.context.fb.group(this.buildControls());
    }

    protected buildAppointmentTemp() {
        const newAppointmetTemp: AppointmentTemplate = new AppointmentTemplate();
        const formModel = this.context.form.value;
        newAppointmetTemp.caremoduleId = formModel.caremoduleId;
        newAppointmetTemp.title = formModel.title;
        newAppointmetTemp.name = 'Appointment Template';
        newAppointmetTemp.description = formModel.description;
        newAppointmetTemp.location = formModel.location;
        return newAppointmetTemp;
    }
}
