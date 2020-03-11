import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication.service';
import { UnauthorizedHandler } from './unauthorized-handler';
import { RequestUtils } from '@lib/utils/request-utils';

@Injectable()
export class AuthorisationInterceptor implements HttpInterceptor {
    private whiteList = [
        {
            method: 'POST',
            url: `${environment.baseUrl}/oauth/token`,
            type: 'password',
        },
    ];

    constructor(private unauthorizedHandler: UnauthorizedHandler) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (this.isRequestWhiteListed(request)) {
            return next.handle(request);
        }

        request = RequestUtils.includeAuthHeader(
            request,
            AuthenticationService.getAccessToken(),
        );

        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                   // This if is used to bypass the Url request from the token call for change password screen
                   if (!(request.url.search('/change-password') !== -1)) {
                    return this.unauthorizedHandler.handle(request, next);
                    }
                }

                return observableThrowError(error);
            }),
        );
    }

    private isRequestWhiteListed(request: HttpRequest<any>) {
        return Boolean(
            this.whiteList.find(obj => {
                return (
                    obj.method === request.method &&
                    obj.url === request.url &&
                    obj.type === request.body.grant_type
                );
            }),
        );
    }
}
