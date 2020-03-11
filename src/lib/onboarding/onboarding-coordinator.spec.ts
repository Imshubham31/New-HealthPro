import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { OnboardingCoordinator } from '@lib/onboarding/onboarding-coordinator.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Router } from '@angular/router';
import { ProfilePictureService } from '@lib/onboarding/profile-picture/profile-picture.service';
import { ConsentService } from '@lib/onboarding/consent/consent.service';
import { PasswordService } from '@lib/shared/components/reset-password/password.service';
import { SharedModule } from '@lib/shared/shared.module';
import { of } from 'rxjs';

describe('OnboardingCoordinator', () => {
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    let onboardingCoordinator: OnboardingCoordinator;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule, SharedModule],
            providers: [
                {
                    provide: AuthenticationService,
                    useValue: {
                        getUserProfile: () => of({}),
                    },
                },
                PasswordService,
                ConsentService,
                ProfilePictureService,
                RouterTestingModule,
                OnboardingCoordinator,
                { provide: Router, useValue: mockRouter },
                {
                    provide: ProfilePictureService,
                    useValue: jasmine.createSpyObj('profilePictureService', [
                        'skipProfilePicture',
                    ]),
                },
            ],
        });
        onboardingCoordinator = TestBed.get(OnboardingCoordinator);
    });

    it('should start', () => {
        onboardingCoordinator.start();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/onboarding']);
    });

    it('should go to consent page', () => {
        spyOn(AuthenticationService, 'getUser').and.callFake(function() {
            return {
                hcpId: '1',
                documentsAccepted: [],
                hasCompletedOnboarding: false,
                onboardingState: {
                    hasUpdatedPassword: false,
                    hasUpdatedProfilePicture: false,
                    hasConsented: false,
                },
            };
        });
        onboardingCoordinator.start();
        expect(onboardingCoordinator.showConsent()).toBe(true);
        expect(onboardingCoordinator.pageNumber).toBe(1);
    });

    it('should go to password page', () => {
        spyOn(AuthenticationService, 'getUser').and.callFake(function() {
            return {
                hcpId: '1',
                documentsAccepted: ['document 1', 'document 2', 'document 3'],
                hasCompletedOnboarding: false,
                onboardingState: {
                    hasUpdatedPassword: false,
                    hasUpdatedProfilePicture: false,
                    hasConsented: true,
                },
            };
        });
        onboardingCoordinator.start();
        expect(onboardingCoordinator.showInitialPassword()).toBe(true);
        expect(onboardingCoordinator.pageNumber).toBe(2);
    });

    it('should show spinner', () => {
        spyOn(AuthenticationService, 'getUser').and.callFake(function() {
            return {
                hcpId: '1',
                documentsAccepted: ['document 1', 'document 2', 'document 3'],
                hasCompletedOnboarding: false,
                onboardingState: {
                    hasUpdatedPassword: true,
                    hasUpdatedProfilePicture: true,
                    hasConsented: true,
                },
            };
        });
        onboardingCoordinator.start();
        // expect(onboardingCoordinator.showLoading()).toBe(true);
    });

    it('should go to profile picture page', () => {
        spyOn(AuthenticationService, 'getUser').and.callFake(function() {
            return {
                hcpId: '1',
                documentsAccepted: ['document 1', 'document 2', 'document 3'],
                hasCompletedOnboarding: false,
                onboardingState: {
                    hasUpdatedPassword: true,
                    hasUpdatedProfilePicture: false,
                    hasConsented: true,
                },
            };
        });
        onboardingCoordinator.start();
        expect(onboardingCoordinator.showProfilePicture()).toBe(true);
        expect(onboardingCoordinator.pageNumber).toBe(3);
    });

    it('should go to finish onboarding', () => {
        onboardingCoordinator.finishOnboarding();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should skip profile pic and go to finish onboarding', () => {
        const service: jasmine.SpyObj<ProfilePictureService> = TestBed.get(
            ProfilePictureService,
        );
        service.skipProfilePicture.and.returnValue(of({}));
        onboardingCoordinator.skipProfilePictureAndFinish();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        expect(service.skipProfilePicture).toHaveBeenCalled();
    });
});
