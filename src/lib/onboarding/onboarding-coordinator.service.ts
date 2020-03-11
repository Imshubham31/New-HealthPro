import { ProfilePictureService } from './profile-picture/profile-picture.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { oc } from 'ts-optchain';

export enum OnboardingStates {
    InitialPassword,
    ProfilePicture,
    Consent,
    Loading,
}

@Injectable()
export class OnboardingCoordinator {
    pageNumber: number;
    hasLoadedDocuments: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private profilePictureService: ProfilePictureService,
    ) {}

    start() {
        this.router.navigate(['/onboarding']);
    }

    showInitialPassword() {
        return this.getOnboardingState() === OnboardingStates.InitialPassword;
    }

    showProfilePicture() {
        return this.getOnboardingState() === OnboardingStates.ProfilePicture;
    }

    showConsent() {
        return this.getOnboardingState() === OnboardingStates.Consent;
    }

    showLoading() {
        return this.getOnboardingState() === OnboardingStates.Loading;
    }

    getOnboardingState() {
        const user = AuthenticationService.getUser();
        if (oc(user).onboardingState.hasConsented() === false) {
            this.pageNumber = 1;
            return OnboardingStates.Consent;
        }
        if (oc(user).onboardingState.hasUpdatedPassword() === false) {
            this.pageNumber = 2;
            return OnboardingStates.InitialPassword;
        }
        if (oc(user).onboardingState.hasUpdatedProfilePicture() === false) {
            this.pageNumber = 3;
            return OnboardingStates.ProfilePicture;
        }
        // if (AuthenticationService.fullyConsentedValue() === false) {
        //     this.pageNumber = 1;
        //     return OnboardingStates.Consent;
        // }
        return OnboardingStates.Loading;
    }

    finishOnboarding() {
        // AuthenticationService.setFullyConsented();
        this.authService.getUserProfile().subscribe(() => {
            this.router.navigate(['/']);
        });
    }

    skipProfilePictureAndFinish() {
        this.profilePictureService
            .skipProfilePicture()
            .subscribe(() => this.finishOnboarding());
    }
}
