import { AuthenticationService } from '@lib/authentication/authentication.service';
import { TestHCPs } from 'test/support/test-hcps';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { Subject, of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { LocaliseService } from '@lib/localise/localise.service';
import { Router, NavigationEnd, Event } from '@angular/router';

import SpyObj = jasmine.SpyObj;
import { skipWhile, filter } from 'rxjs/operators';
import { EnvService } from '@lib/shared/services/env.service';
import { ACTIVITY_TRACKER_TOKEN } from '@lib/utils/activity-tracker';
@Component({
    selector: 'navigation-bar',
    template: '<p>template</p>',
})
class MockNavigationBarComponent {}

@Component({
    selector: 'modal-placeholder',
    template: '<p>template</p>',
})
class MockModalPlaceholderComponent {}

@Component({
    selector: 'toast-container',
    template: '<p>template</p>',
})
class MockToastContainerComponent {}

describe('AppComponent', () => {
    let appCoordinator: SpyObj<AppCoordinator>;
    let localise: SpyObj<LocaliseService>;
    let component: AppComponent;
    let env: SpyObj<EnvService>;
    const routerEvents$ = new Subject<Event>();
    const router = {
        events: routerEvents$,
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
                AppComponent,
                MockNavigationBarComponent,
                MockModalPlaceholderComponent,
                MockToastContainerComponent,
                MockLocalisePipe,
            ],
            providers: [
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('translate', ['use']),
                },
                {
                    provide: AppCoordinator,
                    useValue: jasmine.createSpyObj('appCoordinator', [
                        'onLogin',
                    ]),
                },
                {
                    provide: Router,
                    useValue: {
                        events: routerEvents$,
                    },
                },

                {
                    provide: EnvService,
                    useValue: jasmine.createSpyObj('envService', ['get']),
                },
                {
                    provide: ACTIVITY_TRACKER_TOKEN,
                    useValue: { start: () => {} },
                },
            ],
        });
    });

    beforeEach(() => {
        appCoordinator = TestBed.get(AppCoordinator);
        localise = TestBed.get(LocaliseService);
        component = TestBed.createComponent(AppComponent).componentInstance;
        env = TestBed.get(EnvService);
        appCoordinator.onLogin.and.returnValue(of({}));
    });

    afterEach(() => {
        appCoordinator.onLogin.calls.reset();
        AuthenticationService.deleteUser();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    describe('ngOnInit', () => {
        describe('if not logged in', () => {
            it('should subscribe to login on app coordinator', () => {
                AuthenticationService.deleteUser();
                component.ngOnInit();
                expect(appCoordinator.onLogin).toHaveBeenCalled();
            });
        });
        describe('if logged in', () => {
            it('should subscribe to login on app coordinator', () => {
                AuthenticationService.setUser(TestHCPs.createDrCollins());
                component.ngOnInit();
                expect(appCoordinator.onLogin).not.toHaveBeenCalled();
                AuthenticationService.deleteUser();
            });
        });
        it('should subscribe to loading overlay on app coordinator', () => {
            const loadingOverlay = spyOn(
                AppCoordinator.loadingOverlay,
                'subscribe',
            );
            component.ngOnInit();
            expect(loadingOverlay).toHaveBeenCalled();
        });
        it('should use language', () => {
            const user = TestHCPs.createDrCollins();
            AuthenticationService.setUser(user);
            component.ngOnInit();
            expect(localise.use).toHaveBeenCalledWith(user.language);
            AuthenticationService.deleteUser();
        });
        describe('on router events', () => {
            it('should stop loading spinner', done => {
                AppCoordinator.loadingOverlay
                    .pipe(skipWhile(state => state.loading === false))
                    .subscribe(event => {
                        expect(event).toBeDefined();
                        done();
                    });
                AppCoordinator.loadingOverlay.next({ loading: true });
                routerEvents$.next(new NavigationEnd(1, 'url', 'redirect'));
            });
            it('should not show navbar if endpoint is /login', done => {
                testEventShowsNavbar('/login', '/login', false, done);
            });
            it('should not show navbar if endpoint is /onboarding', done => {
                testEventShowsNavbar('/onboarding', '/onboarding', false, done);
            });
            it('should not show navbar if endpoint is /forget-password', done => {
                testEventShowsNavbar(
                    '/forgot-password',
                    '/forgot-password',
                    false,
                    done,
                );
            });
            it('should show navbar if endpoint is anything else', done => {
                spyOnProperty(
                    AuthenticationService,
                    'isLoggedIn',
                    'get',
                ).and.returnValue(true);
                testEventShowsNavbar('/url', '/url', true, done);
            });

            it('should show "url" if "urlAfterRedirects" is unset', done => {
                spyOnProperty(
                    AuthenticationService,
                    'isLoggedIn',
                    'get',
                ).and.returnValue(true);
                testEventShowsNavbar('/url', undefined, true, done);
            });

            it('should not show nav bar if user is not logged in', done => {
                spyOnProperty(
                    AuthenticationService,
                    'isLoggedIn',
                    'get',
                ).and.returnValue(false);
                testEventShowsNavbar('/url', undefined, false, done);
            });

            function testEventShowsNavbar(
                url: string,
                urlAfterRedirects: string,
                shouldShow: boolean,
                done: DoneFn,
            ) {
                component.showNavBar = !shouldShow;
                component.ngOnInit();
                router.events
                    .pipe(filter(() => component.showNavBar === shouldShow))
                    .subscribe(() => done());
                router.events.next(
                    new NavigationEnd(1, url, urlAfterRedirects),
                );
            }
        });

        describe('logout', () => {
            beforeEach(() => {
                AuthenticationService.setUser(TestHCPs.createDrCollins());
                AuthenticationService.setAuthToken({
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
                });
            });
            it('should delete auth token', () => {
                env.get.and.returnValue({ canRefresh: false });
                component.logout();
                expect(AuthenticationService.getAuthToken()).toBe(null);
            });
            it('should delete user', () => {
                env.get.and.returnValue({ canRefresh: false });
                component.logout();
                expect(AuthenticationService.getUser()).toBe(null);
            });

            it('should skip if in dev mode', () => {
                env.get.and.returnValue({ canRefresh: true });
                component.logout();
                expect(AuthenticationService.getAuthToken()).not.toBe(null);
                expect(AuthenticationService.getUser()).not.toBe(null);
            });
        });
    });
});
