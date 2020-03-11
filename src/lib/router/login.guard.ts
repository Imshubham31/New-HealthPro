import { CanActivate } from '@angular/router';
import { AuthenticationService } from '@lib/authentication/authentication.service';

export class LoginGuard implements CanActivate {
    canActivate(): boolean {
        if (!this.userIsLoggedIn()) {
            return true;
        }

        AuthenticationService.onLoginSuccess.next(
            AuthenticationService.getUser(),
        );
        return false;
    }

    private userIsLoggedIn() {
        return Boolean(AuthenticationService.getAuthToken());
    }
}
