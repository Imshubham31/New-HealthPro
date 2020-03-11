import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { User } from '@lib/authentication/user.model';
import { UserRestService } from '@lib/authentication/user-rest.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Observable } from 'rxjs';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';

@Injectable()
export class PasswordService {
    user: User;

    constructor(private userRestService: UserRestService) {
        this.user = AuthenticationService.getUser();
    }

    resetPassword(password: string, token: string): Observable<RESTSuccess> {
        return this.userRestService.update(
            null,
            { password, token },
            { subPath: '/update-password' },
        );
    }

    changePassword(payload: PasswordChangeRequest) {
        return this.userRestService
            .create(payload, {
                subPath: '/change-password',
            })
            .pipe(
                tap(res => {
                    if (this.user !== null) {
                        this.user.onboardingState.hasUpdatedPassword = true;
                        AuthenticationService.setUser(this.user);
                    }
                }),
            );
    }
}

export interface PasswordChangeRequest {
    oldPassword?: string;
    newPassword: string;
}
