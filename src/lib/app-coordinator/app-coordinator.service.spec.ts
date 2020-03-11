import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppCoordinator } from './app-coordinator.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';
import SpyObj = jasmine.SpyObj;
describe('AppCoordinator', () => {
    let mockRouter: SpyObj<Router>;
    const mockUser = new User();

    let injector: TestBed;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                AuthenticationService,
                AppCoordinator,
                LocaliseService,
                LANGUAGE_PROVIDERS,
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
            ],
        });
    });

    beforeEach(() => {
        injector = getTestBed();
        injector.get(AppCoordinator);
        TestBed.get(AppCoordinator)
            .onLogin()
            .subscribe();
        mockRouter = TestBed.get(Router);
    });

    it('should go to root when user is not null', () => {
        AuthenticationService.onLoginSuccess.subscribe(next => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        });
        AuthenticationService.onLoginSuccess.next(mockUser);
    });

    it('should go to login when user is null', () => {
        AuthenticationService.onLoginSuccess.subscribe(next => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        });
        AuthenticationService.onLoginSuccess.next(null);
    });
});
