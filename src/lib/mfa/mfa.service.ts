import { Injectable } from '@angular/core';
import { MfaRestService, MfaOption } from './mfa-rest.service';
import { mergeMap, map, tap } from 'rxjs/operators';
import {
    LoginBody,
    Token,
    AuthenticationService,
} from '../authentication/authentication.service';
import { AppState } from 'app.state';
import { Observable } from 'rxjs/Observable';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';

@Injectable()
export class MfaService {
    constructor(private restService: MfaRestService) {}

    verifyCode(code: string) {
        const payload: LoginBody = {
            mfa_code: code,
            grant_type: 'mfa_code',
            client_id: AppState.clientId,
        };
        return this.restService.verifyMfa(payload).pipe(
            tap((token: Token) => {
                AuthenticationService.setAuthToken(token);
            }),
        );
    }

    sendVerificationCode(mfaId: string): Observable<RESTSuccess> {
        return this.restService.postVerificationCode(mfaId);
    }

    getValidatedOption(): Observable<MfaOption> {
        return this.restService
            .getMfaOptions()
            .pipe(map(res => (res as any).find(option => option.validated)));
    }

    updateMfaOption(option: MfaOption): Observable<MfaOption> {
        return this.restService
            .postMfaOption(option)
            .pipe(mergeMap(res => this.sendCodeAndGetMethod(res.mfaOptionId)));
    }

    private sendCodeAndGetMethod(mfaId: string): Observable<MfaOption> {
        return this.sendVerificationCode(mfaId).pipe(
            mergeMap(() => this.getMfaOption(mfaId)),
        );
    }

    private getMfaOption(id: string): Observable<MfaOption> {
        return this.restService
            .getMfaOptions()
            .pipe(map(res => (res as any).find(option => option.id === id)));
    }
}
