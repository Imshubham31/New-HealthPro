import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseRestService } from '@lib/jnj-rest/base-rest.service';

@Injectable()
export class SurgeonsRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'surgeries');
    }
}
