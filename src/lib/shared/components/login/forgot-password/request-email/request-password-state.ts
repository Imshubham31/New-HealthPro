import {
    PasswordComponentState,
    PasswordComponent,
} from '../../../reset-password/password.component';
import { Observable } from 'rxjs';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';

export class ResetPasswordState implements PasswordComponentState {
    constructor(private token: string) {}
    public updatePassword(context: PasswordComponent): Observable<RESTSuccess> {
        return context.passwordService.resetPassword(
            context.form.value.confirmNewPassword,
            this.token,
        );
    }
}
