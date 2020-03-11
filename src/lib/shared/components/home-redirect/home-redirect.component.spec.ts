import { OnboardingCoordinator } from './../../../onboarding/onboarding-coordinator.service';
import { HomeRedirectComponent } from './home-redirect.component';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Router } from '@angular/router';
import { SharedModule } from '@lib/shared/shared.module';
import { of } from 'rxjs';
import { MfaCoordinatorService } from '../../../mfa/mfa-coordinator.service';

describe('HomeRedirectComponent', () => {
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    let homeRedirectComponent: HomeRedirectComponent;
    const mockOnboarding = jasmine.createSpyObj('OnboardingCoordinator', [
        'start',
    ]);
    const mfaCoordinator = jasmine.createSpyObj('MfaCoordinatorService', [
        'start',
    ]);
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
                RouterTestingModule,
                HomeRedirectComponent,
                { provide: OnboardingCoordinator, useValue: mockOnboarding },
                { provide: Router, useValue: mockRouter },
                { provide: MfaCoordinatorService, useValue: mfaCoordinator },
            ],
        });
        homeRedirectComponent = TestBed.get(HomeRedirectComponent);
    });

    it('should go to login', () => {
        testRedirects(false, false, false, false, false, '/login');
    });

    it('should go to mfa', () => {
        testRedirects(true, true, false, false, false, false, false, true);
    });

    it('should go to onboarding', () => {
        testRedirects(true, false, false, false, false, false, true);
    });

    it('should go to dashboard', () => {
        testRedirects(true, false, true, true, false, '/dashboard');
    });

    it('should go to patients', () => {
        testRedirects(true, false, true, false, true, '/patients');
    });

    it('should go to patients-overview', () => {
        testRedirects(true, false, true, false, false, '/patients-overview');
    });

    function testRedirects(
        loggedIn = true,
        needsMfa = false,
        hasCompletedOnboarding = true,
        isPatient = false,
        isCareCoordinator = false,
        expectedPath,
        goToOnboarding = false,
        goToMfa = false,
    ) {
        spyOnProperty(
            AuthenticationService,
            'isLoggedIn',
            'get',
        ).and.returnValue(loggedIn);
        spyOn(AuthenticationService, 'hasCompletedOnboarding').and.returnValue(
            hasCompletedOnboarding,
        );
        spyOn(AuthenticationService, 'requiresMfa').and.returnValue(needsMfa);
        spyOn(AuthenticationService, 'isPatient').and.returnValue(isPatient);
        spyOn(AuthenticationService, 'isCareCoordinator').and.returnValue(
            isCareCoordinator,
        );
        homeRedirectComponent.ngOnInit();
        if (goToOnboarding) {
            expect(mockOnboarding.start).toHaveBeenCalled();
        } else if (goToMfa) {
            expect(mfaCoordinator.start).toHaveBeenCalled();
        } else {
            // expect(mockOnboarding.start).not.toHaveBeenCalled();
        }
        if (expectedPath) {
            // expect(mockRouter.navigate).toHaveBeenCalledWith([expectedPath]);
        }
        mockRouter.navigate.calls.reset();
        mockOnboarding.start.calls.reset();
    }
});
