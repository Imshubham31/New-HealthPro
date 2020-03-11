import { Injectable } from '@angular/core';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class RegistrationRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'patients');
    }
}

