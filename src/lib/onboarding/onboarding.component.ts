import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { PasswordComponentState } from '@lib/shared/components/reset-password/password.component';
import {
    OnboardingCoordinator,
    OnboardingStates,
} from './onboarding-coordinator.service';
import { InitialPasswordState } from './initial-password-state';

@Component({
    selector: 'app-onboarding',
    templateUrl: 'onboarding.component.html',
    styleUrls: ['onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
    user: User;
    passwordComponentState: PasswordComponentState;
    state: OnboardingStates;

    constructor(public onboardingCoordinator: OnboardingCoordinator) {
        this.user = AuthenticationService.getUser();
        this.passwordComponentState = new InitialPasswordState();
    }

    ngOnInit(): void {
        if (!this.user) {
            AuthenticationService.logout();
        }
    }
}
