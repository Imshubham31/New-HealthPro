import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ConfirmationModalComponent } from '@lib/onboarding/consent/confirmation-modal/confirmation-modal.component';
import { ConsentService } from '@lib/onboarding/consent/consent.service';
import { Observable } from 'rxjs/Observable';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalWrapperComponent } from './../../../shared/components/modal-wrapper/modal-wrapper.component';

import SpyObj = jasmine.SpyObj;
class PageObject {
    component: ConfirmationModalComponent;
    constructor(public fixture: ComponentFixture<ConfirmationModalComponent>) {
        this.component = fixture.componentInstance;
    }

    get modal() {
        return this.fixture.debugElement.query(By.css('#modal-title'));
    }

    get modalTitle() {
        return this.fixture.debugElement.query(By.css('#modal-title'))
            .nativeElement.innerText;
    }

    get modalSubtitle() {
        return this.fixture.debugElement.query(By.css('#modal-subtitle'))
            .nativeElement.innerText;
    }

    get submitButton() {
        return this.fixture.debugElement.query(By.css('#submitConfirmation'));
    }

    get cancelButton() {
        return this.fixture.debugElement.query(By.css('#cancelConfirmation'));
    }

    clickSubmit() {
        this.submitButton.nativeElement.click();
        this.fixture.detectChanges();
    }

    clickCancel() {
        this.cancelButton.nativeElement.click();
        this.fixture.detectChanges();
    }

    openModal() {
        return new Promise(resolve => {
            this.component.modal.onOpenModal.subscribe(() => {
                this.fixture.detectChanges();
                resolve();
            });
            this.component.open();
        });
    }
}
describe('ConfirmationModalComponent', () => {
    const translations = {
        optOutTitle: 'Title',
        optOutSubtitle: 'Subtitle',
    };
    let consentService: SpyObj<ConsentService>;
    let localiseService: SpyObj<LocaliseService>;
    let page: PageObject;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationModalComponent,
                ModalWrapperComponent,
                MockLocalisePipe,
            ],
            providers: [
                {
                    provide: ConsentService,
                    useValue: jasmine.createSpyObj('consentService', [
                        'declineConsentDocuments',
                    ]),
                },
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localiseService', [
                        'fromKey',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        consentService = TestBed.get(ConsentService);
        localiseService = TestBed.get(LocaliseService);
        localiseService.fromKey.and.callFake(key => translations[key]);
        page = new PageObject(
            TestBed.createComponent(ConfirmationModalComponent),
        );
    });
    xdescribe('behavioural', () => {
        beforeEach(async () => {
            await page.openModal();
        });
        it('should display title', () =>
            expect(page.modalTitle).toBe(translations.optOutTitle));

        it('should display subtitle', () =>
            expect(page.modalSubtitle).toBe(translations.optOutSubtitle));

        describe('"I Am Sure" button', () => {
            it('should display submit', () =>
                expect(page.submitButton.nativeElement.innerText).toBe(
                    'iAmSure',
                ));

            it('should submit', () => {
                consentService.declineConsentDocuments.and.returnValue(
                    Observable.create(obs => obs.next()),
                );
                page.clickSubmit();
                expect(
                    consentService.declineConsentDocuments,
                ).toHaveBeenCalled();
            });
        });

        describe('"Cancel" button', () => {
            it('should display cancel button', () =>
                expect(page.cancelButton.nativeElement.innerText).toBe(
                    'CANCEL',
                ));

            it('should close on click', () => {
                const spy = spyOn(page.component.modal, 'closeModal');
                page.clickCancel();
                expect(spy).toHaveBeenCalled();
            });
        });
    });
    describe('unit', () => {
        it('should get title', () =>
            expect(page.component.getTitle()).toBe(translations.optOutTitle));

        it('should get sub title', () =>
            expect(page.component.getSubtitle()).toBe(
                translations.optOutSubtitle,
            ));
        it('should open modal', () => {
            const spy = spyOn(page.component.modal, 'openModal');
            page.component.open();
            expect(spy).toHaveBeenCalled();
        });
        it('should close modal', () => {
            const spy = spyOn(page.component.modal, 'closeModal');
            page.component.close();
            expect(spy).toHaveBeenCalled();
        });
        describe('declineDocuments', () => {
            let authSpy;
            beforeEach(() => {
                authSpy = spyOn(AuthenticationService, 'logout').and.callFake(
                    () => {},
                );
            });
            it('should start submitting', () => {
                consentService.declineConsentDocuments.and.returnValue(
                    Observable.create(obs => obs.next()),
                );
                page.component.declineDocuments();
                expect(page.component.isSubmitting).toBe(true);
            });
            it('should stop submitting', () => {
                consentService.declineConsentDocuments.and.returnValue(
                    Observable.create(obs => obs.complete()),
                );
                page.component.declineDocuments();
                expect(page.component.isSubmitting).toBe(false);
            });
            it('should logout', () => {
                consentService.declineConsentDocuments.and.returnValue(
                    Observable.create(obs => obs.next()),
                );
                page.component.declineDocuments();
                expect(authSpy).toHaveBeenCalled();
            });
        });
    });
});
