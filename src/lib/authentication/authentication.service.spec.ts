import { HttpClientModule } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { async, TestBed, getTestBed } from '@angular/core/testing';
import { XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ActivatedRouteSnapshot, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@lib/shared/shared.module';
import { AuthenticationService, Token } from './authentication.service';
import { User, UserConsent } from './user.model';

import { environment } from '../../environments/environment';
import { TestHCPs } from 'test/support/test-hcps';
import { MfaCoordinatorService } from '@lib/mfa/mfa-coordinator.service';

describe('Authentication Service', () => {
    const mockRoute = new ActivatedRouteSnapshot();
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let authService: AuthenticationService;
    mockRoute.url = [new UrlSegment('', {})];
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
    const userConsent: UserConsent = {
        key: 'key',
        revision: 'revision',
        documentId: 'documentId',
    };
    const user: User = {
        fullName: 'fullName',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        nickname: 'nickname',
        phoneNumber: 'phoneNumber',
        hospitalId: 'hospitalId',
        dateFormat: 'dateFormat',
        firstDayOfWeek: 'firstDayOfWeek',
        hasCompletedOnboarding: true,
        onboardingState: {
            hasUpdatedPassword: true,
            hasUpdatedProfilePicture: true,
            hasConsented: true,
        },
        documentsAccepted: [userConsent],
    };

    configureTestSuite(() => {
        const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);
        const mfaCoordinator = jasmine.createSpyObj('MfaCoordinatorService', [
            'start',
        ]);
        sessionStorage.clear();
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                SharedModule,
                HttpClientTestingModule,
            ],
            providers: [
                AuthenticationService,
                RouterTestingModule,
                { provide: XHRBackend, useClass: MockBackend },
                { provide: Router, useValue: fakeRouter },
                { provide: MfaCoordinatorService, useValue: mfaCoordinator },
            ],
        });
        injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
        authService = injector.get(AuthenticationService);
    });

    afterEach(() => {
        httpMock.verify();
        AuthenticationService.deleteAuthToken();
        AuthenticationService.deleteUser();
    });

    it('should login and set authToken and user data', () => {
        spyOn(AuthenticationService.onLoginSuccess, 'next');
        authService
            .login({ username: 'user', password: 'password' })
            .subscribe();
        const reqToken = httpMock.expectOne(
            `${environment.baseUrl}/oauth/token`,
        );
        reqToken.flush(token);
        const reqUser = httpMock.expectOne(`${environment.baseUrl}/user`);
        reqUser.flush({ data: user });
        expect(AuthenticationService.getAccessToken()).toBe(token.access_token);
        expect(AuthenticationService.getUser()).toEqual(user);
        expect(AuthenticationService.onLoginSuccess.next).toHaveBeenCalled();
    });

    it('should not login and return general error', () => {
        authService.login({ username: 'user', password: 'password' }).subscribe(
            result => {},
            err => {
                expect(err.message).toBeDefined();
            },
        );
        const req = httpMock.expectOne(`${environment.baseUrl}/oauth/token`);
        req.flush({}, { status: 0, statusText: 'unknownError' });
    });

    it('should not login if user not found', () => {
        authService.login({ username: 'user', password: 'password' }).subscribe(
            result => {},
            err => {
                expect(err).toBeDefined();
            },
        );
        const reqToken = httpMock.expectOne(
            `${environment.baseUrl}/oauth/token`,
        );
        reqToken.flush(token);
        const reqUser = httpMock.expectOne(`${environment.baseUrl}/user`);
        reqUser.error(new ErrorEvent('error'));
    });

    it('should handle login incorrect error', () => {
        authService.login({ username: 'user', password: 'password' }).subscribe(
            result => {},
            err => {
                expect(err.status).toBe(401);
            },
        );
        const req = httpMock.expectOne(`${environment.baseUrl}/oauth/token`);
        req.flush({}, { status: 401, statusText: '401 error' });
    });

    it('should handle login blocked error', () => {
        authService.login({ username: 'user', password: 'password' }).subscribe(
            result => {},
            err => {
                expect(err.status).toBe(403);
            },
        );
        const req = httpMock.expectOne(`${environment.baseUrl}/oauth/token`);
        req.flush({}, { status: 403, statusText: '401 error' });
    });

    it('get latest accepted consent docs', () => {
        const mockUser = new User();
        mockUser.documentsAccepted = [
            {
                key: 'hcp_consent',
                revision: '1',
                dateAccepted: new Date().toISOString(),
                documentId: 'id',
            },
            {
                key: 'legal',
                revision: '1',
                dateAccepted: new Date(Date.now() + 1).toISOString(),
                documentId: 'id',
            },
        ];

        spyOn(AuthenticationService, 'getUser').and.returnValue(mockUser);
        expect(AuthenticationService.getAcceptedLegalDocuments().length).toBe(
            2,
        );
        expect(AuthenticationService.getAcceptedLegalDocuments()[0].key).toBe(
            mockUser.documentsAccepted[0].key,
        );
    });

    it('should logout', () => {
        AuthenticationService.setAuthToken(token);
        AuthenticationService.setUser(new User());
        const spy = spyOn(AuthenticationService, 'reload').and.callFake(
            () => {},
        );
        AuthenticationService.logout();
        expect(spy).toHaveBeenCalled();
        expect(AuthenticationService.getUser()).toBeNull();
        expect(AuthenticationService.getAuthToken()).toBeNull();
    });

    it('should have completedOnboarding', () => {
        const mockUser = new User();
        mockUser.hasCompletedOnboarding = true;
        spyOn(AuthenticationService, 'getUser').and.returnValue(mockUser);
        expect(AuthenticationService.hasCompletedOnboarding()).toBeTruthy();
    });

    it('should not have completedOnboarding', () => {
        const mockUser = new User();
        mockUser.hasCompletedOnboarding = false;
        mockUser.onboardingState = {
            hasConsented: false,
            hasUpdatedPassword: false,
            hasUpdatedProfilePicture: false,
        };
        expect(AuthenticationService.hasConsented(mockUser)).toBeFalsy();
        expect(AuthenticationService.hasUpdatedPassword(mockUser)).toBeFalsy();
        expect(
            AuthenticationService.hasUpdatedProfilePicture(mockUser),
        ).toBeFalsy();
        spyOn(AuthenticationService, 'getUser').and.returnValue(mockUser);
        expect(AuthenticationService.hasCompletedOnboarding()).toBeFalsy();
    });

    it('should not return language if user is not defined', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue(null);
        expect(AuthenticationService.getUserLanguage()).toBeNull();
    });

    it('should return user language', () => {
        const mockUser = new User();
        mockUser.language = 'en_EN';
        spyOn(AuthenticationService, 'getUser').and.returnValue(mockUser);
        expect(AuthenticationService.getUserLanguage()).toBe(mockUser.language);
    });

    it('should set auth token', () => {
        AuthenticationService.setAuthToken(token);
        expect(AuthenticationService.getAuthToken().access_token).toBe(
            token.access_token,
        );
    });

    it('should set isRestrictedRequested', () => {
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        AuthenticationService.setIsRestrictedRequested();
        expect(AuthenticationService.getUser().isRestrictedRequested).toBe(
            true,
        );
        AuthenticationService.deleteUser();
    });

    it('should not get access token', () => {
        expect(AuthenticationService.getAccessToken()).toBeNull();
    });

    it('should update token', async(() => {
        AuthenticationService.setAuthToken(token);
        const newToken = AuthenticationService.getAuthToken();
        newToken.access_token = 'newAccessToken';
        AuthenticationService.updateToken(newToken);
        expect(AuthenticationService.getAccessToken()).toBe(
            newToken.access_token,
        );
    }));

    it('should be care coordinator', () => {
        spyOn(AuthenticationService, 'getAuthToken').and.returnValue({
            user: {
                roles: ['ROLE_CARE_COORDINATOR'],
            },
        });
        expect(AuthenticationService.isCareCoordinator()).toBeTruthy();
    });

    it('should not be care coordinator', () => {
        spyOn(AuthenticationService, 'getAuthToken').and.returnValue({
            user: {
                roles: ['ROLE_HCP'],
            },
        });
        expect(AuthenticationService.isCareCoordinator()).toBeFalsy();
    });

    it('should be patient', () => {
        spyOn(AuthenticationService, 'getAuthToken').and.returnValue({
            user: {
                roles: ['ROLE_PATIENT'],
            },
        });
        expect(AuthenticationService.isPatient()).toBeTruthy();
    });
});
