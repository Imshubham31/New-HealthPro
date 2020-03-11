import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User, UserConsent } from '@lib/authentication/user.model';
import { ConsentRestService } from './consent-rest.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';
// import { HttpHeaders } from '@angular/common/http';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'environments/environment';

export interface AcceptedLegalDocumnets {
    acceptedDocument: UserConsent;
    consentDocument: ConsentDocument;
}
@Injectable()
export class ConsentService {
    user: User;

    constructor(
        private consentRestService: ConsentRestService,
        private hospitalsRestService: HospitalsRestService,
        // private http: HttpClient
    ) {
        this.user = AuthenticationService.getUser();
    }

    getConsentDocs() {
        return this.hospitalsRestService
            .find<ConsentDocument>({
                subPath: `/${this.user.hospitalId}/consents`,
            })
            .map(result => result.data);
    }
    // getuserConsentDocs() {
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + AuthenticationService.hasToken(),
    //     });
    //     return this.http.get(`${environment.baseUrl}/user/consents`, {headers});
    // }
    submitConsentDocuments(userConsents: UserConsent[]) {
        return this.consentRestService.create({ documents: userConsents }).pipe(
            tap(res => {
                this.user.documentsAccepted = userConsents;
                this.user.onboardingState.hasConsented = true;
                this.user.onboardingState.consentDate = new Date().toISOString();
                AuthenticationService.setUser(this.user);
            }),
        );
    }

    declineConsentDocuments() {
        return this.consentRestService.create({ documents: [] });
    }

    getLegalDocs$(): Observable<AcceptedLegalDocumnets[]> {
        const acceptedDocuments = AuthenticationService.getAcceptedLegalDocuments();
        const filter = acceptedDocuments.map(doc => ({
            documentId: doc.documentId,
            revision: Number(doc.revision),
        }));
        return this.consentRestService
            .filter({
                filter,
            })
            .pipe(
                map(res => {
                    return res.data.map(consentDocument => ({
                        consentDocument,
                        acceptedDocument: acceptedDocuments.find(
                            doc =>
                                doc.documentId === consentDocument.documentId,
                        ),
                    }));
                }),
            );
    }
}
