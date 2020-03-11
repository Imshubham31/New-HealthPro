import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

import { AuthenticationService } from '@lib/authentication/authentication.service';

@Injectable()
export class TokenRefreshService implements CanActivateChild {
    constructor(public router: Router) {}

    canActivateChild(): boolean {
        const token = AuthenticationService.getAuthToken();
        if (token) {
            return true;
        }

        AuthenticationService.logout();
        this.router.navigate(['/login']);
        return false;
    }
}
