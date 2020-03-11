import {
    PasswordComponentState,
    PasswordComponent,
} from '@lib/shared/components/reset-password/password.component';
import { Observable } from 'rxjs';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';

export class InitialPasswordState implements PasswordComponentState {
    public updatePassword(context: PasswordComponent): Observable<RESTSuccess> {
        return context.passwordService.changePassword({
            newPassword: context.form.value.confirmNewPassword,
        });
    }
}
