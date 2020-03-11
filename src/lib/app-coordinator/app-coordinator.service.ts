import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from '../../../node_modules/rxjs/operators';

export interface LoadingOverlay {
    loading: boolean;
    message?: string;
    hideMessage?: boolean;
}

@Injectable()
export class AppCoordinator {
    // TODO: We need to remove this static loader in favour of loaders on individual components
    static loadingOverlay = new BehaviorSubject<LoadingOverlay>({
        loading: false,
    });
    user: User;
    constructor(
        private router: Router,
        private localiseService: LocaliseService,
    ) {}

    onLogin() {
        return AuthenticationService.onLoginSuccess.pipe(
            tap(user => this.handleLoginSuccess(user)),
        );
    }

    private handleLoginSuccess(user: User) {
        if (!user) {
            AuthenticationService.deleteAuthToken();
            AuthenticationService.deleteUser();
            this.router.navigate(['/login']);
        } else {
            AuthenticationService.setUser(user);
            this.localiseService.use(AuthenticationService.getUserLanguage());
            this.user = user;
            this.router.navigate(['/']);
        }
    }
}
