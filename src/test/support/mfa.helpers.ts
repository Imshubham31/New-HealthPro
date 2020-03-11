import { MfaState } from './../../lib/mfa/mfa-coordinator.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MfaCoordinatorService } from '@lib/mfa/mfa-coordinator.service';
import { MfaService } from '@lib/mfa/mfa.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { ComponentFixture } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { MfaMethod } from '@lib/mfa/mfa-rest.service';

export class MfaHelpers {
    public static emailPhoneTestingConfig: any = {
        imports: [LocaliseModule],
        declarations: [],
        providers: [
            FormBuilder,
            {
                provide: LocaliseService,
                useValue: {
                    ...jasmine.createSpyObj('localiseService', [
                        'fromKey',
                        'fromParams',
                    ]),
                },
            },
            {
                provide: MfaCoordinatorService,
                useValue: {
                    ...jasmine.createSpyObj('mfaCoordinatorService', [
                        'start',
                        'goToStartMfa',
                        'goToSelectMethod',
                        'goToAddPhone',
                        'goToAddEmail',
                        'goToEnterCode',
                        'goToSuccess',
                        'updateState',
                    ]),
                    state: new BehaviorSubject<MfaState>({
                        isRegFlow: true,
                        option: {
                            id: '1',
                            mfaDestination: '',
                            mfaMethod: MfaMethod.email,
                        },
                        loginEmail: 'test@test',
                        pageNumber: 1,
                        pageCount: 5,
                    }),
                },
            },
            {
                provide: MfaService,
                useValue: jasmine.createSpyObj('mfaService', {
                    updateMfaOption: of(),
                    verifyCode: of(),
                    sendVerificationCode: of(),
                }),
            },
            {
                provide: AuthenticationService,
                useValue: jasmine.createSpyObj('authService', [
                    'getUserProfile',
                ]),
            },
            {
                provide: ToastService,
                useValue: jasmine.createSpyObj('toastService', ['show']),
            },
        ],
        schemas: [NO_ERRORS_SCHEMA],
    };
    public static executeEmailPhoneEntryTests = <T>(
        testBed: any,
        classType: T,
        submitFunctionName: String,
        successSpyName: String,
        ignoreSubmitting: Boolean = false,
    ) => {
        let component: any;
        let fixture: ComponentFixture<T>;
        let coordinator: any;
        let service: any;
        let toast: any;
        let localiseService;
        describe('(execute shared tests)', () => {
            beforeEach(() => {
                fixture = testBed.createComponent(classType);
                component = fixture.componentInstance;
                coordinator = testBed.get(MfaCoordinatorService);
                service = testBed.get(MfaService);
                toast = testBed.get(ToastService);
                localiseService = testBed.get(LocaliseService);
                localiseService.fromKey.and.returnValue('');
                localiseService.fromParams.and.returnValue('');
                fixture.detectChanges();
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });

            it('should navigate back when needed', () => {
                coordinator.goToSelectMethod.calls.reset();
                if (!ignoreSubmitting) {
                    component.submitting = true;
                    expect(component.shouldDisableSubmit()).toBe(true);
                    component.goBack();
                    expect(coordinator.goToSelectMethod).not.toHaveBeenCalled();
                    component.submitting = false;
                }
                component.goBack();
                expect(coordinator.goToSelectMethod).toHaveBeenCalled();
            });

            it('should handle successful submit', () => {
                coordinator[`${successSpyName}`].calls.reset();
                service[`${submitFunctionName}`].and.returnValue(of('success'));
                component.submit();
                expect(coordinator[`${successSpyName}`]).toHaveBeenCalled();
            });

            it('should handle error on submit', () => {
                toast.show.calls.reset();
                service[`${submitFunctionName}`].and.returnValue(
                    throwError({}),
                );
                component.submit();
                expect(toast.show).toHaveBeenCalledWith(
                    null,
                    jasmine.any(String),
                    ToastStyles.Error,
                );
            });
        });
    }
}
