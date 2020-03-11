import { Injectable } from '@angular/core';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AppointmentRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'templates/appointments');
    }
}
