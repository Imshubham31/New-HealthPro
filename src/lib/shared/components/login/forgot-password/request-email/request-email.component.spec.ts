import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocaliseService } from '@lib/localise/localise.service';
import { RequestEmailComponent } from '@lib/shared/components/login/forgot-password/request-email/request-email.component';
import { RequestEmailService } from '@lib/shared/components/login/forgot-password/request-email/request-email.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { of, throwError } from 'rxjs';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';

import SpyObj = jasmine.SpyObj;

describe('RequestEmailComponent', () => {
    let router: SpyObj<Router>;
    let modalService: SpyObj<ModalService>;
    let localise: SpyObj<LocaliseService>;
    let requestEmailService: SpyObj<RequestEmailService>;
    let component: RequestEmailComponent;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [RequestEmailComponent, MockLocalisePipe],
            providers: [
                {
                    provide: RequestEmailService,
                    useValue: jasmine.createSpyObj('requestEmailService', [
                        'sendPasswordEmail',
                    ]),
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localiseService', [
                        'fromKey',
                        'fromParams',
                    ]),
                },
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
            ],
        });
    });

    beforeEach(() => {
        router = TestBed.get(Router);
        modalService = TestBed.get(ModalService);
        localise = TestBed.get(LocaliseService);
        requestEmailService = TestBed.get(RequestEmailService);

        localise.fromKey.and.callFake(key => key);
        localise.fromParams.and.callFake(
            (key, params) => `${key}-${params.join()}`,
        );
    });
    beforeEach(() => {
        component = TestBed.createComponent(RequestEmailComponent)
            .componentInstance;
    });
    describe('setupForm', () => {
        beforeEach(() => {
            component.setupForm();
        });
        it('should create form', () =>
            expect(component.resetPasswordForm).toBeDefined());
        it('should create have an email field', () =>
            expect(component.resetPasswordForm.get('email')).toBeDefined());
        it('email field should be required', () =>
            expect(
                component.resetPasswordForm.get('email').errors.required,
            ).toBe(true));
        it('email field should have email validation and fail', () => {
            component.resetPasswordForm.get('email').setValue('notAnEmail');
            expect(component.resetPasswordForm.get('email').errors.email).toBe(
                true,
            );
        });
        it('email field should have email validation and pass', () => {
            component.resetPasswordForm
                .get('email')
                .setValue('test@example.com');
            expect(component.resetPasswordForm.get('email').errors).toBe(null);
        });
        it('email field should have max length 100 and fail', () => {
            component.resetPasswordForm
                .get('email')
                .setValue(Array(101).fill('x'));
            expect(
                component.resetPasswordForm.get('email').errors.maxlength
                    .requiredLength,
            ).toBe(100);
            expect(
                component.resetPasswordForm.get('email').errors.maxlength
                    .actualLength,
            ).toBe(101);
        });
        it('email field should have max length 100 and pass', () => {
            component.resetPasswordForm
                .get('email')
                .setValue(Array(100).fill('x'));
            expect(
                component.resetPasswordForm.get('email').errors.maxlength,
            ).toBeUndefined();
        });
    });

    describe('backToLogin', () => {
        it('should navigate back to login', () => {
            component.backToLogin();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('submit', () => {
        beforeEach(() => {});
        describe('onSuccess', () => {
            beforeEach(() => {
                component.setupForm();
                modalService.create.and.returnValue({ open: () => {} });
                component.resetPasswordForm
                    .get('email')
                    .setValue('test@example.com');
                requestEmailService.sendPasswordEmail.and.returnValue(of({}));
                component.submit();
            });

            afterEach(() => modalService.create.calls.reset());

            it('should call send password for email', () => {
                expect(
                    requestEmailService.sendPasswordEmail,
                ).toHaveBeenCalledWith('test@example.com');
            });

            it('should not be submitting', () => {
                expect(component.submitting).toBe(false);
            });
            it('should update email', () => {
                expect(component.email).toBe('test@example.com');
            });
            it('should show confirmation modal', () => {
                expect(modalService.create).toHaveBeenCalled();
            });
        });
        describe('onError', () => {
            beforeEach(() => {
                component.setupForm();
                component.resetPasswordForm
                    .get('email')
                    .setValue('test@example.com');
            });

            it('should invalid email error on 400', () => {
                requestEmailService.sendPasswordEmail.and.returnValue(
                    throwError({
                        error: {
                            code: 400,
                        },
                    }),
                );
                component.submit();
                expect(component.formError).toBe('invalidEmailError');
            });

            it('should invalid email error on 400', () => {
                const message = 'message';
                requestEmailService.sendPasswordEmail.and.returnValue(
                    throwError({
                        error: {
                            code: 500,
                            message,
                        },
                    }),
                );
                component.submit();
                expect(component.formError).toBe(message);
            });

            it('should not update email', () => {
                requestEmailService.sendPasswordEmail.and.returnValue(
                    throwError({
                        error: {
                            code: 400,
                        },
                    }),
                );
                component.submit();
                expect(component.email).toBeUndefined();
            });

            it('should not show confirmation modal', () => {
                requestEmailService.sendPasswordEmail.and.returnValue(
                    throwError({
                        error: {
                            code: 400,
                        },
                    }),
                );
                component.submit();
                expect(modalService.create).not.toHaveBeenCalled();
            });
        });
    });

    describe('showConfirmationModal', () => {
        it('should create PasswordConfirmationModalComponent and open', done => {
            // TODO: this test is probably asserting too much and should be broken into different tests
            component.email = 'email';
            modalService.create.and.callFake((comp, options) => {
                expect(comp.name).toBe('PasswordConfirmationModalComponent');
                expect(options.title).toBe('emailSent');
                expect(options.subtitle).toBe('emailConfirmation-email');
                return {
                    title: options.title,
                    subtitle: options.subtitle,
                    open: done,
                };
            });
            component.showConfirmationModal();
        });
    });

    describe('shouldDisableSubmit', () => {
        it('should be disabled if form is invalid', () => {
            expect(component.shouldDisableSubmit()).toBe(true);
        });
        it('should be disabled if form is submitting', () => {
            component.submitting = true;
            expect(component.shouldDisableSubmit()).toBe(true);
        });
        it('should be enabled if valid and not submitting', () => {
            component.resetPasswordForm
                .get('email')
                .setValue('test@example.com');
            expect(component.shouldDisableSubmit()).toBe(false);
        });
    });
});
