import { HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { ConsentRestService } from './consent-rest.service';
import { ConsentService } from './consent.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';
import { of } from 'rxjs';

const mockUser = new User();
mockUser.onboardingState = {
    hasConsented: false,
    hasUpdatedPassword: false,
    hasUpdatedProfilePicture: false,
};
mockUser.documentsAccepted = [
    {
        key: 'hcp_consent',
        revision: '1',
        dateAccepted: new Date().toISOString(),
        documentId: 'id',
    },
    {
        key: 'hcp_legal',
        revision: '1',
        dateAccepted: new Date(Date.now() + 1).toISOString(),
        documentId: 'id',
    },
];

const mockDocumentsAccepted = [
    {
        key: 'hcp_consent',
        revision: '2',
        dateAccepted: new Date().toISOString(),
        documentId: 'id',
    },
    {
        key: 'hcp_legal',
        revision: '2',
        dateAccepted: new Date(Date.now() + 1).toISOString(),
        documentId: 'id',
    },
];

const mockDoc: ConsentDocument = {
    body: 'body',
    key: 'hcp_consent',
    title: 'title',
    version: '1',
    documentId: 'id',
};

const declinedResponse = { message: 'success' };

const mockConsentRestService = {
    create: () => of(declinedResponse),
    findOne: () =>
        Observable.create(observer => observer.next({ data: mockDoc })),
    filter: () => of({ data: [mockDoc] }),
};

const mockHospitalRestService = {
    find: () =>
        Observable.create(observer => observer.next({ data: [mockDoc] })),
};

describe('Consent Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule, LocaliseModule],
            providers: [
                AuthenticationService,
                ConsentService,
                LocaliseService,
                {
                    provide: ConsentRestService,
                    useValue: mockConsentRestService,
                },
                {
                    provide: HospitalsRestService,
                    useValue: mockHospitalRestService,
                },
            ],
        });
        AuthenticationService.setUser(mockUser);
    });

    it('should get consent docs', async(
        inject([ConsentService], (consentService: ConsentService) => {
            consentService.getConsentDocs().subscribe(docs => {
                expect(docs.length).toEqual(1);
                expect(docs[0].key).toEqual('hcp_consent');
            });
        }),
    ));

    it('should save user consents', async(
        inject([ConsentService], (consentService: ConsentService) => {
            consentService
                .submitConsentDocuments(mockDocumentsAccepted)
                .subscribe(doc => {
                    expect(
                        AuthenticationService.getUser().documentsAccepted
                            .length,
                    ).toEqual(2);
                    expect(
                        AuthenticationService.getUser().documentsAccepted[0]
                            .revision,
                    ).toEqual('2');
                    expect(
                        AuthenticationService.getUser().onboardingState
                            .hasConsented,
                    ).toBeTruthy();
                });
        }),
    ));

    it('should get accepted legal docs', inject(
        [ConsentService],
        (consentService: ConsentService) => {
            consentService
                .getLegalDocs$()
                .subscribe(docs =>
                    expect(docs[0].acceptedDocument.documentId).toEqual(
                        mockDoc.documentId,
                    ),
                );
        },
    ));

    it('should decline consent', inject(
        [ConsentService],
        (consentService: ConsentService) => {
            consentService
                .declineConsentDocuments()
                .subscribe(res =>
                    expect(res.message).toEqual(declinedResponse.message),
                );
        },
    ));
});
