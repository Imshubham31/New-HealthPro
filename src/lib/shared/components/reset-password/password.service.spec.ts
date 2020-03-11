import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordService } from './password.service';
import { User } from '@lib/authentication/user.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { OnboardingCoordinator } from '@lib/onboarding/onboarding-coordinator.service';
import { UserRestService } from '@lib/authentication/user-rest.service';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';

const mockUser = new User();
mockUser.onboardingState = {
    hasConsented: true,
    hasUpdatedPassword: false,
    hasUpdatedProfilePicture: false,
};

const mockRestService = {
    create: () => Observable.create(observer => observer.next()),
    update: () => Observable.create(observer => observer.next()),
};

describe('Password Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                AuthenticationService,
                PasswordService,
                AppCoordinator,
                OnboardingCoordinator,
                { provide: UserRestService, useValue: mockRestService },
            ],
        });
        AuthenticationService.setUser(mockUser);
    });

    it('should set initial password password', async(
        inject([PasswordService], (passwordService: PasswordService) => {
            passwordService
                .changePassword({ newPassword: 'password' })
                .subscribe(res => {
                    expect(
                        AuthenticationService.getUser().onboardingState
                            .hasUpdatedPassword,
                    ).toEqual(true);
                });
        }),
    ));

    // TODO: Fix this. Figure out why spy isn't working
    xit('should reset password with token', async(
        inject([PasswordService], (passwordService: PasswordService) => {
            spyOn(mockRestService, 'update');
            passwordService
                .resetPassword('password', 'token')
                .subscribe(res => {
                    expect(mockRestService).toHaveBeenCalled();
                });
        }),
    ));
});
