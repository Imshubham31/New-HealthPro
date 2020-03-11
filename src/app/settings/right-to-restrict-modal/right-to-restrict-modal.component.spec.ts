import { TestHCPs } from './../../../test/support/test-hcps';
import { of, throwError, BehaviorSubject } from 'rxjs';
import {
    ToastService,
    ToastStyles,
} from './../../../lib/shared/components/toast/toast.service';
// prettier-ignore
import { LocaliseService } from '@lib/localise/localise.service';
import { TestBed } from '@angular/core/testing';
import {
    RightToRestrictModalComponent,
    RightToRestrictReasons,
} from './right-to-restrict-modal.component';
import { RightToRestrictModalComponentPage } from './right-to-restrict-modal.page-object';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import SpyObj = jasmine.SpyObj;
import { UserPrivacyService } from '../user-privacy.service';
import { EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordRequiredDialogComponent } from '../password-required-dialog/password-required-dialog.component';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { HospitalService } from '@lib/hospitals/hospital.service';

describe('RightToRestrictModalComponent', () => {
    let page: RightToRestrictModalComponentPage;
    let modalService: SpyObj<ModalService>;
    let userPrivacyService: SpyObj<UserPrivacyService>;
    let toastService: SpyObj<ToastService>;
    let hospitalService: SpyObj<HospitalService>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: key => key,
                        fromParams: (key, params) => `${key}-${params[0]}`,
                    },
                },
                {
                    provide: UserPrivacyService,
                    useValue: jasmine.createSpyObj('userPrivacyService', [
                        'initiateRightToRestrictProcessing$',
                    ]),
                },
                {
                    provide: ToastService,
                    useValue: jasmine.createSpyObj('toastService', ['show']),
                },
                {
                    provide: ErrorPipe,
                    useValue: {
                        transform: err => {
                            if (err.code === 9999) {
                                return 'unknownError';
                            }
                            return err;
                        },
                    },
                },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of(),
                        hospital: new BehaviorSubject({
                            name: 'test',
                            integrated: true,
                        }),
                    },
                },
            ],
            declarations: [
                RightToRestrictModalComponent,
                MockLocalisePipe,
                ModalWrapperComponent,
                ErrorPipe,
            ],
        });
    });

    beforeEach(() => {
        page = new RightToRestrictModalComponentPage(
            TestBed.createComponent(RightToRestrictModalComponent),
        );
        modalService = TestBed.get(ModalService);
        userPrivacyService = TestBed.get(UserPrivacyService);
        toastService = TestBed.get(ToastService);
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        hospitalService = TestBed.get(HospitalService);
    });
    afterEach(() => {
        toastService.show.calls.reset();
        userPrivacyService.initiateRightToRestrictProcessing$.calls.reset();
        AuthenticationService.deleteUser();
    });
    describe('behaviors', () => {
        beforeEach(() => page.openModal());

        it('should open', () => expect(page.modal).toBeTruthy());
        it('should display title', () =>
            expect(page.modalTitle).toBe('rightToRestrictTitle'));
        it('should display GDPR question', () =>
            expect(page.gdprQuestion).toBe('rightToRestrictQuestion'));
        it('should display "Data Accuracy" option', () =>
            expect(
                page.getGdprOptionSpan(RightToRestrictReasons.DataAccuracy)
                    .nativeElement.innerHTML,
            ).toBe(RightToRestrictReasons.DataAccuracy));
        it('should display "Unlawful Processing" option', () =>
            expect(
                page.getGdprOptionSpan(
                    RightToRestrictReasons.UnlawfulProcessing,
                ).nativeElement.innerHTML,
            ).toBe(RightToRestrictReasons.UnlawfulProcessing));
        it('should display "Legal Claim" option', () =>
            expect(
                page.getGdprOptionSpan(RightToRestrictReasons.LegalClaim)
                    .nativeElement.innerHTML,
            ).toBe(RightToRestrictReasons.LegalClaim));

        describe('explanation field', () => {
            it('should display label for explanation field', () =>
                expect(page.rightToRestrictExplanationLabel).toBe(
                    'rightToRestrictExplanation',
                ));
            it('should display textarea for explanation field', () =>
                expect(page.rightToRestrictExplanationTextarea).toBeTruthy());
            it('should display placeholder text for explanation field', () =>
                expect(page.rightToRestrictExplanationPlaceholder).toBe(
                    'rightToRestrictExplanationPlaceholder',
                ));
            it('should be disabled if no reason is provided', () => {
                page.getGdprOptionInput(
                    RightToRestrictReasons.DataAccuracy,
                ).nativeElement.checked = false;
                page.getGdprOptionInput(
                    RightToRestrictReasons.DataAccuracy,
                ).nativeElement.dispatchEvent(new Event('input'));
                page.fixture.detectChanges();
                expect(
                    page.rightToRestrictExplanationTextarea.nativeElement
                        .disabled,
                ).toBeTruthy();
            });

            // TODO: Find a way of triggering disabled during tests
            xit('should be enabled if reason is provided', () => {
                page.getGdprOptionInput(
                    RightToRestrictReasons.DataAccuracy,
                ).nativeElement.checked = true;
                page.fixture.detectChanges();
                expect(
                    page.rightToRestrictExplanationTextarea.nativeElement
                        .disabled,
                ).toBeFalsy();
            });
        });
        describe('submit button', () => {
            it('should display title "restrict Processing" button', () => {
                expect(page.submitButton).toBeTruthy();
                expect(page.submitButton.nativeElement.innerHTML.trim()).toBe(
                    'restrictProcessing',
                );
            });
            // TODO: Find a way of triggering disabled during tests
            xit('should be disabled if no reason or explanation is provided', () => {
                fail('incomplete');
            });
            // TODO: Find a way of triggering disabled during tests
            xit('should be enabled if reason and explanation is provided', () => {
                fail('incomplete');
            });
            describe('on click', () => {
                beforeEach(() => {
                    page.component.form
                        .get('gdprOptions')
                        .setValue(RightToRestrictReasons.DataAccuracy);
                });
                it('should display confirmation modal', done => {
                    hospitalService.hospital.value.integrated = true;
                    modalService.create.and.returnValue({
                        open: done,
                        onSuccess: new EventEmitter(),
                    });
                    page.component.showPasswordConfirmation();
                    expect(modalService.create).toHaveBeenCalledTimes(1);
                    expect(modalService.create).toHaveBeenCalledWith(
                        PasswordRequiredDialogComponent,
                        {
                            title: 'rightToRestrictConfirmationTitle',
                            subtitle: 'rightToRestrictConfirmationDescription',
                        },
                    );
                });
            });
        });
        describe('on confirmation', () => {
            it('should submit', () => {
                const onSuccess = new EventEmitter();
                userPrivacyService.initiateRightToRestrictProcessing$.and.returnValue(
                    of({}),
                );
                modalService.create.and.returnValue({
                    open: () => {},
                    onSuccess,
                });
                page.component.showPasswordConfirmation();
                onSuccess.next();
                expect(
                    userPrivacyService.initiateRightToRestrictProcessing$,
                ).toHaveBeenCalledTimes(1);
            });
        });
        describe('on confirmation', () => {
            describe('when restriction has been request', () => {
                it('should show message and close', () => {
                    const onSuccess = new EventEmitter();
                    userPrivacyService.initiateRightToRestrictProcessing$.and.returnValue(
                        of({}),
                    );
                    modalService.create.and.returnValue({
                        open: () => {},
                        onSuccess,
                    });
                    page.component.showPasswordConfirmation();
                    onSuccess.next();
                    expect(
                        userPrivacyService.initiateRightToRestrictProcessing$,
                    ).toHaveBeenCalledTimes(1);
                    expect(toastService.show).toHaveBeenCalledWith(
                        'requestRestrictionSubmitted',
                        undefined,
                        ToastStyles.Success,
                    );
                    expect(
                        AuthenticationService.getUser().isRestrictedRequested,
                    ).toBe(true);
                });
            });

            describe('when unknown error has occurred', () => {
                it('should show error', () => {
                    const onSuccess = new EventEmitter();
                    userPrivacyService.initiateRightToRestrictProcessing$.and.returnValue(
                        throwError(
                            new HttpErrorResponse({ error: { code: 9999 } }),
                        ),
                    );
                    modalService.create.and.returnValue({
                        open: () => {},
                        onSuccess,
                    });
                    page.component.showPasswordConfirmation();
                    onSuccess.next();
                    expect(
                        userPrivacyService.initiateRightToRestrictProcessing$,
                    ).toHaveBeenCalledTimes(1);
                    expect(page.component.formError).toEqual(
                        Object({ code: 9999 }),
                    );
                });
            });
        });

        describe('cancel button', () => {
            it('should close modal', done => {
                page.component.close();
                page.fixture.detectChanges();
                page.fixture.whenStable().then(() => {
                    expect(page.modal).toBeFalsy();
                    done();
                });
            });
        });

        describe('onInit', () => {
            it('should set correct text when hospital is integrated', () => {
                hospitalService.hospital.value.integrated = true;
                page.component.ngOnInit();
                expect(page.component.restrictText).toEqual(
                    'rightToRestrictConfirmationDescription',
                );
            });

            it('should set correct text when hospital is non-integrated', () => {
                hospitalService.hospital.value.integrated = false;
                page.component.ngOnInit();
                expect(page.component.restrictText).toEqual(
                    'rightToRestrictConfirmationDescriptionNonIntegrated',
                );
            });
        });
    });
});
