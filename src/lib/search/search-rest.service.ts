import { HttpClient } from '@angular/common/http';
import { RESTControls, FindResponse } from './../jnj-rest/base-rest.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export interface SearchBody {
    entities: string[];
    filters: {
        searchName: string;
    };
}
@Injectable()
export class SearchRestService {
    private restControls = new RESTControls('search');

    constructor(private http: HttpClient) {}

    findMessageParticipants(): Observable<FindResponse<ParticipantDetails>> {
        return this.http.post<FindResponse<ParticipantDetails>>(
            this.restControls.getUrl() + '/participants',
            {
                entities: ['patients', 'hcps'],
                filters: {
                    searchName: name,
                },
            },
            this.restControls.getHttpOptions({}),
        );
    }
}
