import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocaliseService } from '@lib/localise/localise.service';
import { RequestUtils } from '@lib/utils/request-utils';

@Injectable()
export class LocaliseInterceptor implements HttpInterceptor {
    constructor(private localise: LocaliseService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        request = RequestUtils.includeLangHeader(
            request,
            this.localise.getLocale(),
        );

        return next.handle(request);
    }
}
