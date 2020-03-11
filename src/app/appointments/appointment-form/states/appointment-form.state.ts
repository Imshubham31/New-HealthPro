import { BaseForm } from '../../../../lib/shared/services/base-form';
import { AppointmentFormComponent } from '../appointment-form.component';
import { Observable } from 'rxjs';

export interface AppointmentFormState {
    readonly context: AppointmentFormComponent & BaseForm;
    readonly submitButtonTextKey: string;
    readonly titleTextKey: string;
    submit(): Observable<any>;
}
