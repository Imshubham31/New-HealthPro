import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineLatest, of, throwError } from 'rxjs';

import { BaseRestService, RequestOptions } from './base-rest.service';

describe('App', () => {
    let service: BaseRestService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [RouterTestingModule, HttpClient],
        });
        service = new BaseRestService(TestBed.get(HttpClient), 'path');
    });

    function buildObservables(options?: RequestOptions) {
        return [
            service.create({}, options),
            service.find(options),
            service.findOne(1, options),
            service.patch(1, {}, options),
            service.update(1, {}, options),
            service.batchUpdate([], options),
            service.remove(1, options),
        ];
    }
    it('should call default path to empty string', () => {
        const testService = new BaseRestService(TestBed.get(HttpClient));
        expect(testService.path).toBe('');
    });

    it('should call REST endpoints and respond with success', () => {
        const body = {
            message: 'success',
        };
        spyOn(service.http, 'post').and.returnValue(of(body));
        spyOn(service.http, 'put').and.returnValue(of(body));
        spyOn(service.http, 'patch').and.returnValue(of(body));
        spyOn(service.http, 'get').and.returnValue(of(body));
        spyOn(service.http, 'delete').and.returnValue(of(body));
        combineLatest(buildObservables()).subscribe(res =>
            expect(res).not.toBe(null),
        );
    });

    xit('should call REST endpoints with GxP reason and Params', () => {
        const body = {
            message: 'success',
        };
        const gxpReason = 'gxpReason';
        const params = new HttpParams().set('test', 'testParam');
        const assertOptions = options => {
            expect(options.headers.get('GxP-Modification-Reason')).toBe(
                gxpReason,
            );
            expect(options.headers.get('Content-Type')).toBe(
                'application/json',
            );
            expect(options.params).toBe(params);
        };
        const fake = (url, options) => {
            assertOptions(options);
            return of(body);
        };
        const fakeWithModel = (url, model, options) => {
            assertOptions(options);
            return of(body);
        };

        spyOn(service.http, 'post').and.callFake(fakeWithModel);
        spyOn(service.http, 'put').and.callFake(fakeWithModel);
        spyOn(service.http, 'patch').and.callFake(fakeWithModel);
        spyOn(service.http, 'get').and.callFake(fake);
        spyOn(service.http, 'delete').and.callFake(fake);
        combineLatest(buildObservables({ gxpReason, params })).subscribe(res =>
            expect(res).not.toBe(null),
        );
    });

    it('should call REST endpoints and respond with error', () => {
        const body = {
            error: 'error',
        };
        spyOn(service.http, 'post').and.returnValue(throwError(body));
        spyOn(service.http, 'put').and.returnValue(throwError(body));
        spyOn(service.http, 'patch').and.returnValue(throwError(body));
        spyOn(service.http, 'get').and.returnValue(throwError(body));
        spyOn(service.http, 'delete').and.returnValue(throwError(body));
        combineLatest(buildObservables()).subscribe(
            () => {},
            err => expect(err).not.toBe(null),
        );
    });
});
