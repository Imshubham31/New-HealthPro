import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class PatientRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'patient');
    }

    deletePatient(email: string, reason: string) {
        return super.removeWithBody(
            { email },
            {
                gxpReason: reason,
            },
        );
    }
}
