import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseRestService, FindResponse } from '@lib/jnj-rest/base-rest.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';

@Injectable()
export class ConsentRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'users/consent');
    }

    filter(filter: ConsentDocsFilter) {
        return super.create<FindResponse<ConsentDocument>>(filter, {
            subPath: `/filter`,
        });
    }
}

export interface ConsentDocsFilter {
    filter: {
        documentId: string;
        revision: number;
    }[];
}
