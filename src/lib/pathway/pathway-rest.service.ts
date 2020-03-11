import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';

@Injectable()
export class PathwayRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'pathways');
    }
}
