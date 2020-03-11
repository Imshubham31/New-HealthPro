import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { LoginBody } from '@lib/authentication/authentication.service';
import { environment } from 'environments/environment';

@Injectable()
export class MfaRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'user/mfa');
    }

    getMfaOptions() {
        return super.find<MfaOption>({ subPath: `/options` });
    }

    postMfaOption(option: MfaOption) {
        return super.create<CreateMfaOptionResponse>(option, {
            subPath: `/options`,
        });
    }

    postVerificationCode(mfaOptionId: string) {
        return this.create({ mfaOptionId });
    }

    verifyMfa(payload: LoginBody) {
        return this.http.post(`${environment.baseUrl}/oauth/token`, payload);
    }
}

export enum MfaMethod {
    sms = 'SMS',
    email = 'EMAIL',
}

export interface MfaOption {
    id?: string;
    mfaMethod: MfaMethod;
    mfaDestination: string;
    mfaPrimary?: boolean;
    validated?: boolean;
}

export interface CreateMfaOptionResponse {
    mfaOptionId: string;
}
