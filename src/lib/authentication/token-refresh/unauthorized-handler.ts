import { share, map, mergeMap, tap } from 'rxjs/operators';
import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService, Token } from '../authentication.service';
import { environment } from '../../../environments/environment';
import { RequestUtils } from '@lib/utils/request-utils';
import { AppState } from '../../../app.state';

@Injectable()
export class UnauthorizedHandler {
    private refreshToken$: Observable<string>;

    // HttpClient is used by the AuthenticationInterceptor, making a circular ref
    constructor(private http: HttpClient) {}

    handle(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (!this.refreshToken$) {
            this.createRefreshToken$();
        }

        return this.refreshToken$.pipe(
            mergeMap(token =>
                next.handle(RequestUtils.includeAuthHeader(req, token)),
            ),
            tap(() => {
                this.refreshToken$ = null;
            }),
        );
    }

    private createRefreshToken$() {
        const payload = {
            refresh_token: AuthenticationService.getAuthToken().refresh_token,
            grant_type: 'refresh_token',
            client_id: AppState.clientId,
        };

        this.refreshToken$ = this.http
            .post(`${environment.baseUrl}/oauth/token`, payload)
            .pipe(
                tap((token: Token) => {
                    if (token.access_token) {
                        AuthenticationService.updateToken(token);
                    } else {
                        AuthenticationService.logout();
                    }
                }),
                map((token: Token) => token.access_token),
                share(),
            );
    }
}
