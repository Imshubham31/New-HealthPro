import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { FormBuilder } from '@angular/forms';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';
import { ConsentService } from './consent.service';
import { ConsentComponent } from './consent.component';
import { OnboardingCoordinator } from '../onboarding-coordinator.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';
import { Router } from '@angular/router';

describe('ConsentComponent', () => {
    let loggedInUser;
    const mockAuthenticationService = {
        setUser(user: User) {
            loggedInUser = user;
        },
        getUser() {
            return loggedInUser;
        },
    };

    const mockOnboardingCoordinator = {};

    const mockConsentService = {
        submitConsentDocuments(documents: Object) {
            return this.create(documents);
        },
        create: (model: Object): Observable<RESTSuccess> => {
            loggedInUser.documentsAccepted = model;
            mockAuthenticationService.setUser(loggedInUser);
            return Observable.create(observer =>
                observer.next({ message: 'success' }),
            );
        },
        getConsentDocs(): Observable<ConsentDocument[]> {
            return Observable.create(observer =>
                observer.next([
                    {
                        body: 'Document Body 1',
                        key: 'consent',
                        title: 'Title 1',
                        version: 1,
                    },
                    {
                        body: 'Document Body 2',
                        key: 'privacy',
                        title: 'Title 2',
                        version: 1,
                    },
                    {
                        body: 'Document Body 3',
                        key: 'security',
                        title: 'Title 3',
                        version: 1,
                    },
                ]),
            );
        },
        getuserConsentDocs(): Observable<ConsentDocument[]> {
            return Observable.create(observer =>
                observer.next([
                    {
                        body: 'Document Body 1',
                        key: 'consent',
                        title: 'Title 1',
                        version: 1,
                    },
                    {
                        body: 'Document Body 2',
                        key: 'privacy',
                        title: 'Title 2',
                        version: 1,
                    },
                    {
                        body: 'Document Body 3',
                        key: 'security',
                        title: 'Title 3',
                        version: 1,
                    },
                ]),
            );
        },
    };

    let consentComponent: ConsentComponent;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                AuthenticationService,
                ConsentComponent,
                ConsentService,
                FormBuilder,
                OnboardingCoordinator,
                ModalService,
                { provide: ConsentService, useValue: mockConsentService },
                {
                    provide: AuthenticationService,
                    useValue: mockAuthenticationService,
                },
                {
                    provide: OnboardingCoordinator,
                    useValue: mockOnboardingCoordinator,
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
            ],
        });
    });

    beforeEach(() => {
        loggedInUser = {
            hcpId: '1',
            hasCompletedOnboarding: false,
            onboardingState: {
                hasUpdatedPassword: false,
                hasUpdatedProfilePicture: false,
            },
        };
        consentComponent = TestBed.get(ConsentComponent);
    });
    xit('should have loaded documents', async(() => {
        expect(consentComponent.documents.length).toBe(3);
        expect(consentComponent.currentPosition()).toBe('(1/3)');
    }));

    xit('should set accept first document', async(() => {
        consentComponent.submit();
        expect(consentComponent.consents.length).toBe(1);
        expect(consentComponent.consents[0].key).toBe('consent');
        expect(consentComponent.currentPosition()).toBe('(2/3)');
    }));

    xit('should set accept second document', async(() => {
        consentComponent.submit();
        consentComponent.submit();
        expect(consentComponent.consents.length).toBe(2);
        expect(consentComponent.consents[1].key).toBe('privacy');
        expect(consentComponent.currentPosition()).toBe('(3/3)');
    }));

    xit('should submit documents', async(() => {
        consentComponent.submit();
        consentComponent.submit();
        consentComponent.submit();
        expect(
            mockAuthenticationService.getUser().documentsAccepted.length,
        ).toBe(3);
    }));
});
