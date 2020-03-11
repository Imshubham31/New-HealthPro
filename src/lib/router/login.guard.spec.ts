import {
    AuthenticationService,
    Token,
} from '@lib/authentication/authentication.service';
import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
    const guard = new LoginGuard();

    const token: Token = {
        access_token: 'haHTiNx5rFHs8gPhvDXOLp3cRe2O',
        refresh_token: '2QNKiGHWMsC58tv6BGgGwRGXKKAA5rf4',
        scope: '',
        expires_in: 3599,
        user: {
            mfa_required: false,
            pw_expired: false,
            roles: ['ROLE_HCP'],
            fully_consented: false,
        },
    };

    beforeEach(() => {
        AuthenticationService.deleteAuthToken();
        AuthenticationService.onLoginSuccess.observers.forEach((obs: any) => {
            obs.unsubscribe();
        });
    });

    afterEach(() => {
        AuthenticationService.deleteAuthToken();
    });

    describe('when the user is not logged in', () => {
        it('should return true', () => {
            expect(guard.canActivate()).toBeTruthy();
        });
    });

    describe('when the user is logged in', () => {
        beforeEach(() => {
            AuthenticationService.setAuthToken(token);
        });

        it('should return false', () => {
            expect(guard.canActivate()).toBeFalsy();
        });

        it('should emit the onLoginSuccess event on the AuthenticationService', () => {
            const spy = jasmine.createSpy('onLoginSuccess');

            AuthenticationService.onLoginSuccess.subscribe(() => spy());
            guard.canActivate();

            expect(spy).toHaveBeenCalled();
        });
    });
});
