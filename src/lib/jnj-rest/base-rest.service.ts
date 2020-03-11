import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface RequestOptions {
    subPath?: string;
    gxpReason?: string;
    params?: HttpParams;
}

export interface RESTSuccess {
    message: string;
    resourceId?: number | string;
    chatId?: number;
    currentPhaseId?: string;
    currentSubphaseId?: string;
}

export interface FindResponse<T> {
    data: T[];
}

export interface FindOneResponse<T> {
    data: T;
}

export class RESTControls {
    public readonly path: string;

    constructor(path = '') {
        this.path = path;
    }

    getUrl(id?: any): string {
        if (!id) {
            return `${environment.baseUrl}/${this.path}`;
        }

        return `${environment.baseUrl}/${this.path}/${id}`;
    }

    getHttpOptions(options: RequestOptions) {
        const headers = options.gxpReason
            ? this.getGxpHeaders(options.gxpReason)
            : this.getHeaders();
        return options.params
            ? { headers, withCredentials: false, params: options.params }
            : { headers, withCredentials: false };
    }

    getHeaders() {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        return headers;
    }

    getGxpHeaders(gxpReason: string) {
        let headers = this.getHeaders();
        headers = headers.append('GxP-Modification-Reason', gxpReason);

        return headers;
    }
}

export class BaseRestService {
    private restControls: RESTControls;
    public readonly path: string;
    public http: HttpClient;

    constructor(http: HttpClient, path = '') {
        this.http = http;
        this.path = path;
        this.restControls = new RESTControls(path);
    }

    create<T = RESTSuccess>(
        model: any,
        options: RequestOptions = {},
    ): Observable<T> {
        return this.http.post<T>(
            this.restControls.getUrl() + (options.subPath || ''),
            model,
            this.restControls.getHttpOptions(options),
        );
    }

    find<T>(options: RequestOptions = {}): Observable<FindResponse<T>> {
        return this.http.get<FindResponse<T>>(
            this.restControls.getUrl() + (options.subPath || ''),
            this.restControls.getHttpOptions(options),
        );
    }

    findOne<T>(
        id: any,
        options: RequestOptions = {},
    ): Observable<FindOneResponse<T>> {
        return this.http.get<FindOneResponse<T>>(
            this.restControls.getUrl(id) + (options.subPath || ''),
            this.restControls.getHttpOptions(options),
        );
    }

    update(
        id: any,
        model: Object,
        options: RequestOptions = {},
    ): Observable<RESTSuccess> {
        return this.http.put<RESTSuccess>(
            this.restControls.getUrl(id) + (options.subPath || ''),
            model,
            this.restControls.getHttpOptions(options),
        );
    }

    patch(
        id: any,
        model: Object,
        options: RequestOptions = {},
    ): Observable<RESTSuccess> {
        return this.http.patch<RESTSuccess>(
            this.restControls.getUrl(id) + (options.subPath || ''),
            model,
            this.restControls.getHttpOptions(options),
        );
    }

    remove(id: any, options: RequestOptions = {}): Observable<RESTSuccess> {
        const httpOptions = this.restControls.getHttpOptions(options);
        return this.http.delete<RESTSuccess>(
            this.restControls.getUrl(id) + (options.subPath || ''),
            httpOptions,
        );
    }

    removeWithBody(
        body: Object,
        options: RequestOptions = {},
    ): Observable<RESTSuccess> {
        const httpOptions = this.restControls.getHttpOptions(options);
        return this.http.request<RESTSuccess>(
            'DELETE',
            this.restControls.getUrl('') + (options.subPath || ''),
            {
                ...httpOptions,
                body,
            },
        );
    }

    batchUpdate<T>(
        model: T[],
        options: RequestOptions = {},
    ): Observable<RESTSuccess> {
        return this.http.put<RESTSuccess>(
            `${this.restControls.getUrl()}/batch`,
            model,
            this.restControls.getHttpOptions(options),
        );
    }
}
