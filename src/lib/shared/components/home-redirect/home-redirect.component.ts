import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingCoordinator } from '@lib/onboarding/onboarding-coordinator.service';
import { MfaCoordinatorService } from '../../../mfa/mfa-coordinator.service';

@Component({
    selector: 'loginForm',
    template: '',
})
export class HomeRedirectComponent implements OnInit {
    constructor(
        private router: Router,
        private onboardingCoordinator: OnboardingCoordinator,
        private mfaCoordinator: MfaCoordinatorService,
    ) {}

    ngOnInit() {
        if (!AuthenticationService.isLoggedIn) {
            this.router.navigate(['/login']);
        } else if (AuthenticationService.requiresMfa()) {
            this.mfaCoordinator.start('');
        } else if (!AuthenticationService.hasCompletedOnboarding()) {
            this.onboardingCoordinator.start();
        } else if (AuthenticationService.isPatient()) {
            this.router.navigate(['/dashboard']);
        } else if (AuthenticationService.isCareCoordinator()) {
            this.router.navigate(['/patients']);
        } else {
            this.router.navigate(['/patients-overview']);
        }
        // else if (!AuthenticationService.fullyConsentedValue()) {
        //     this.onboardingCoordinator.start();
        // }
    }
}
