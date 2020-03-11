import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRestService } from '@lib/jnj-rest/base-rest.service';

interface Participant {
    backendId: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

@Injectable()
export class HCPRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'hcps');
    }

    loadPatientsForHcp(backendId: string): Observable<Participant[]> {
        return this.find<Participant>({
            subPath: `/${backendId}/patients`,
        }).map(response => response.data);
    }
}
