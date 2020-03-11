import { AuthenticationService } from './../authentication/authentication.service';
import { TokenRefreshService } from './token-refresh.service';

describe('Token Refresh Service', () => {
    let instance;
    beforeEach(() => {
        instance = new TokenRefreshService({
            navigate: val => val,
        } as any);
    });
    it('canActivateChild should return false if no token', () => {
        spyOn(AuthenticationService, 'getAuthToken').and.callFake(() => false);
        expect(instance.canActivateChild()).toBe(false);
    });
    it('canActivateChild should return true if there is token', () => {
        spyOn(AuthenticationService, 'getAuthToken').and.callFake(
            () => 'token',
        );
        expect(instance.canActivateChild()).toBe(true);
    });
});
