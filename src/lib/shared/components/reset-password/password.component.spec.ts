import { HttpClientModule } from '@angular/common/http';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { PasswordService, PasswordChangeRequest } from './password.service';
import { PasswordComponent } from './password.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { User } from '@lib/authentication/user.model';
import { LocaliseModule } from '@lib/localise/localise.module';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';
import { ResetPasswordState } from '../login/forgot-password/request-email/request-password-state';
import { InitialPasswordState } from '@lib/onboarding/initial-password-state';
import { PasswordRequirementsComponent } from '../password-requirements/password-reqs.component';
import { of } from 'rxjs';

describe('PasswordComponent', () => {
    let loggedInUser;

    const mockAuthenticationService = {
        setUser(user: User) {
            loggedInUser = user;
        },
        getUser() {
            return loggedInUser;
        },
    };

    const mockPasswordService = {
        changePassword(
            password: PasswordChangeRequest,
        ): Observable<RESTSuccess> {
            loggedInUser.onboardingState.hasUpdatedPassword = true;
            mockAuthenticationService.setUser(loggedInUser);
            return of({ message: 'success' });
        },
        resetPassword(
            password: string,
            token: string,
        ): Observable<RESTSuccess> {
            return of({ message: 'success' });
        },
    };

    let passwordComponent: PasswordComponent;
    let fixture: ComponentFixture<PasswordComponent>;
    configureTestSuite(() => {
        loggedInUser = {
            hcpId: '1',
            hasCompletedOnboarding: false,
            onboardingState: {
                hasUpdatedPassword: false,
                hasUpdatedProfilePicture: false,
            },
        };

        TestBed.configureTestingModule({
            imports: [HttpClientModule, ReactiveFormsModule, LocaliseModule],
            declarations: [PasswordComponent, PasswordRequirementsComponent],
            providers: [
                FormBuilder,
                {
                    provide: PasswordService,
                    useValue: mockPasswordService,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordComponent);
        passwordComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    // TODO: Fix this. Figure out why spy isn't working
    xit('should call correct service function based on state', async(() => {
        passwordComponent.state = new ResetPasswordState('token');
        passwordComponent.form.value.newPassword = 'Password1';
        passwordComponent.form.value.confirmNewPassword = 'Password1';
        const spy = spyOn(mockPasswordService, 'resetPassword');
        passwordComponent.submit();
        expect(spy).toHaveBeenCalled();
    }));

    it('should set initial password', async(() => {
        passwordComponent.state = new InitialPasswordState();
        passwordComponent.form.value.newPassword = 'Password1';
        passwordComponent.form.value.confirmNewPassword = 'Password1';
        passwordComponent.submit();
        expect(loggedInUser.onboardingState.hasUpdatedPassword).toBe(true);
    }));

    it('should check passwords on submit', async(() => {
        passwordComponent.state = new InitialPasswordState();
        passwordComponent.form.value.newPassword = 'Password1';
        passwordComponent.form.value.confirmNewPassword = 'Password1';
        spyOn(passwordComponent, 'passwordTooSimple');
        spyOn(passwordComponent, 'passwordsDontMatch');
        passwordComponent.submit();
        expect(passwordComponent.passwordTooSimple).toHaveBeenCalled();
        expect(passwordComponent.passwordsDontMatch).toHaveBeenCalled();
    }));

    it('password should be too short', async(() => {
        passwordComponent.form.value.newPassword = 'a';
        passwordComponent.hasSubmittedOnce = true;
        expect(passwordComponent.passwordTooSimple()).toBe(true);
    }));

    it('password should be too simple', async(() => {
        passwordComponent.form.value.newPassword = 'password';
        passwordComponent.hasSubmittedOnce = true;
        expect(passwordComponent.passwordTooSimple()).toBe(true);
    }));

    it('password should be ok', async(() => {
        passwordComponent.form.value.newPassword = 'Password1';
        passwordComponent.hasSubmittedOnce = true;
        expect(passwordComponent.passwordTooSimple()).toBe(false);
    }));
});
