import { LocaliseService } from '@lib/localise/localise.service';
import { MfaService } from '@lib/mfa/mfa.service';
import { MfaMethod } from './../mfa-rest.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMethodComponent } from './select-method.component';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { By } from '@angular/platform-browser';
import { MfaHelpers } from 'test/support/mfa.helpers';
import { throwError } from 'rxjs';

describe('SelectMethodComponent', () => {
    let component: SelectMethodComponent;
    let fixture: ComponentFixture<SelectMethodComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            ...MfaHelpers.emailPhoneTestingConfig,
            declarations: [SelectMethodComponent, MockLocalisePipe],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectMethodComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('during registration flow', () => {
        it('should move to add phone', () => {
            const button = fixture.debugElement.queryAll(By.css('button'))[0];
            button.triggerEventHandler('click', null);
            expect(
                (component as any).mfaCoordinator.goToAddPhone,
            ).toHaveBeenCalled();
        });

        it('should move to add email', () => {
            const button = fixture.debugElement.queryAll(By.css('button'))[1];
            button.triggerEventHandler('click', null);
            expect(
                (component as any).mfaCoordinator.goToAddEmail,
            ).toHaveBeenCalled();
        });
    });

    describe('during login flow', () => {
        it('should send code and move verify screen', () => {
            component.mfaCoordinator.state.value.isRegFlow = false;
            fixture.detectChanges();
            const button = fixture.debugElement.queryAll(By.css('button'))[0];
            button.triggerEventHandler('click', null);
            expect(
                (component as any).mfaService.sendVerificationCode,
            ).toHaveBeenCalled();
        });

        describe('should show error message', () => {
            function testErrorMessage(
                mfaMethod: MfaMethod,
                expectedErrorKey: String,
            ) {
                const mfaService = TestBed.get(MfaService);
                const localiseService = TestBed.get(LocaliseService);
                mfaService.sendVerificationCode.and.returnValue(
                    throwError(new Error('test')),
                );
                component.mfaCoordinator.state.next({
                    ...component.mfaCoordinator.state.value,
                    option: {
                        ...component.mfaCoordinator.state.value.option,
                        mfaMethod,
                    },
                });
                component.goToVerfiyCode();
                expect(localiseService.fromKey).toHaveBeenCalledWith(
                    expectedErrorKey,
                );
            }

            it('for email', () =>
                testErrorMessage(MfaMethod.email, 'mfaUnableToVerifyEmail'));

            it('for sms', () =>
                testErrorMessage(
                    MfaMethod.sms,
                    'mfaUnableToVerifyPhoneNumber',
                ));
        });
    });
});
