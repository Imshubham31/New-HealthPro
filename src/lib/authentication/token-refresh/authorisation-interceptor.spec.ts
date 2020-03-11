import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;

import { AuthorisationInterceptor } from './authorisation-interceptor';
import { UnauthorizedHandler } from './unauthorized-handler';
import { of, throwError } from 'rxjs';

describe('AuthorisationInterceptor', () => {
    let sut: AuthorisationInterceptor;
    let unauthorizedHandler: SpyObj<UnauthorizedHandler>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthorisationInterceptor,
                {
                    provide: UnauthorizedHandler,
                    useValue: jasmine.createSpyObj('unauthorizedHandler', [
                        'handle',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        sut = TestBed.get(AuthorisationInterceptor);
        unauthorizedHandler = TestBed.get(UnauthorizedHandler);
    });

    describe('#intercept(request, next)', () => {
        let request: HttpRequest<any>;

        const stubHandler: HttpHandler = {
            handle() {
                return throwError(new HttpResponse({ status: 401 }));
            },
        };

        beforeEach(() => {
            unauthorizedHandler.handle.and.returnValue(of());

            request = new HttpRequest<any>('GET', '/patients');
        });

        describe('when the request returns a 401', () => {
            beforeEach(() => {
                sut.intercept(request, stubHandler).subscribe();
            });

            it('should delegate the request to the unauthorized handler', () => {
                expect(unauthorizedHandler.handle).toHaveBeenCalled();
            });
        });
    });
});
