import {
    HttpClient,
    HttpClientModule,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AuthenticationService, Token } from '../authentication.service';
import { UnauthorizedHandler } from './unauthorized-handler';

import SpyObj = jasmine.SpyObj;
import { of, combineLatest } from 'rxjs';

describe('UnauthorizedHandler', () => {
    let sut: UnauthorizedHandler;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [UnauthorizedHandler],
        });
    });

    beforeEach(() => {
        sut = TestBed.get(UnauthorizedHandler);
    });

    describe('#handle(request, next)', () => {
        const token: Token = {
            access_token: 'access_token',
            expires_in: 3600,
            refresh_token: 'refresh_token',
            scope: 'scope',
            user: {
                mfa_required: false,
                pw_expired: false,
                roles: ['HCP'],
                fully_consented: false,
            },
        };
        const request = new HttpRequest<any>('GET', '/patients');
        let handler: SpyObj<HttpHandler>;
        let backend: HttpTestingController;
        let http: HttpClient;

        beforeEach(() => {
            AuthenticationService.setAuthToken(token);
            handler = jasmine.createSpyObj('next', {
                handle: of(),
            });
            backend = TestBed.get(HttpTestingController);
            http = TestBed.get(HttpClient);
        });

        beforeEach(() => sut.handle(request, handler).subscribe());

        afterEach(() => backend.verify());

        it('should request a new token', async(() => {
            backend
                .expectOne({
                    method: 'POST',
                    url: `${environment.baseUrl}/oauth/token`,
                })
                .flush(token);
        }));

        it('should only do a single token refresh request for all incoming calls', async(() => {
            combineLatest(
                sut.handle(request, handler),
                sut.handle(request, handler),
            ).subscribe();
            backend
                .expectOne({
                    method: 'POST',
                    url: `${environment.baseUrl}/oauth/token`,
                })
                .flush(token);
        }));

        describe('when the request is done and a token is returned', () => {
            beforeEach(async(() => {
                backend
                    .expectOne({
                        method: 'POST',
                        url: `${environment.baseUrl}/oauth/token`,
                    })
                    .flush(token);
            }));

            afterEach(() => backend.verify());

            it('should store the refreshed token', async(() => {
                http.get('/test').subscribe(() => {
                    expect(AuthenticationService.getAuthToken()).toEqual(token);
                });
                backend.expectOne('/test').flush({});
            }));

            it('should replay the request with the refreshed token', () => {
                expect(
                    handler.handle.calls
                        .mostRecent()
                        .args[0].headers.get('Authorization'),
                ).toContain(token.access_token);
            });
        });

        describe('when the request is done and no token is returned', () => {
            it('should log the user out', async(() => {
                const logoutSpy = spyOn(AuthenticationService, 'logout');

                http.get('/test').subscribe(() => {
                    expect(logoutSpy).toHaveBeenCalled();
                });

                backend
                    .expectOne({
                        method: 'POST',
                        url: `${environment.baseUrl}/oauth/token`,
                    })
                    .flush({});
                backend.expectOne('/test').flush({});
            }));
        });
    });
});
