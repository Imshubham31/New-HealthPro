import { HttpRequest } from '@angular/common/http';

export class RequestUtils {
    static includeLangHeader(
        req: HttpRequest<any>,
        lang: string,
    ): HttpRequest<any> {
        let headers = req.headers;
        headers = headers.set('Accept-Language', lang);
        return req.clone({ headers });
    }

    static includeAuthHeader(
        req: HttpRequest<any>,
        token: string,
    ): HttpRequest<any> {
        let headers = req.headers;
        headers = headers.set('Authorization', 'Bearer ' + token);
        return req.clone({ headers });
    }
}
