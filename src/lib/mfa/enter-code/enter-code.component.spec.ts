import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { EnterCodeComponent } from './enter-code.component';
import { MfaHelpers } from 'test/support/mfa.helpers';
import { MfaService } from '../mfa.service';
import { of } from 'rxjs';
import { ToastService } from '@lib/shared/components/toast/toast.service';

describe('EnterCodeComponent', () => {
    let component: EnterCodeComponent;
    let fixture: ComponentFixture<EnterCodeComponent>;
    let service: any;
    let toast: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            ...MfaHelpers.emailPhoneTestingConfig,
            declarations: [EnterCodeComponent, MockLocalisePipe],
        }).compileComponents();
    }));

    function keyEv(key, ctrlKey = false, metaKey = false) {
        return {
            key,
            ctrlKey,
            metaKey,
            preventDefault: () => {},
        };
    }

    function paste(data) {
        let dT = null;
        try {
            dT = new DataTransfer();
        } catch (e) {}
        const evt = new ClipboardEvent('paste', { clipboardData: dT });
        evt.clipboardData.setData('text/plain', data);
        return evt;
    }

    MfaHelpers.executeEmailPhoneEntryTests(
        TestBed,
        EnterCodeComponent,
        'verifyCode',
        'goToSuccess',
        true,
    );

    describe('Input tests', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(EnterCodeComponent);
            component = fixture.componentInstance;
            service = TestBed.get(MfaService);
            toast = TestBed.get(ToastService);
            fixture.detectChanges();
        });

        it('should handle new character', () => {
            component.securityCode = '——————';
            component.onKeyDown(keyEv('1'));
            expect(component.securityCode).toBe('1—————');
            component.onKeyDown(keyEv('2'));
            component.onKeyDown(keyEv('3'));
            component.onKeyDown(keyEv('4'));
            expect(component.securityCode).toBe('1234——');
            component.onKeyDown(keyEv('5'));
            component.onKeyDown(keyEv('6'));
            component.onKeyDown(keyEv('7'));
            expect(component.securityCode).toBe('123456');
        });

        it('should handle Backspace', () => {
            component.securityCode = '——————';
            component.onKeyDown(keyEv('9'));
            expect(component.securityCode).toBe('9—————');
            component.onKeyDown(keyEv('Backspace'));
            expect(component.securityCode).toBe('——————');
            component.onKeyDown(keyEv('1'));
            component.onKeyDown(keyEv('2'));
            expect(component.securityCode).toBe('12————');
            component.onKeyDown(keyEv('Backspace'));
            component.onKeyDown(keyEv('Backspace'));
            component.onKeyDown(keyEv('Backspace'));
            component.onKeyDown(keyEv('Backspace'));
            expect(component.securityCode).toBe('——————');
        });

        it('should handle unsupported keys', () => {
            component.securityCode = '—————1';
            component.onKeyDown(keyEv('Unsupported'));
            component.securityCode = '—————1';
            component.onKeyDown(keyEv('1', true));
            component.securityCode = '—————1';
            component.onKeyDown(keyEv('1', false, true));
            component.securityCode = '—————1';
        });

        it('should handle paste', () => {
            component.securityCode = '——————';
            component.onPaste(paste('123'));
            expect(component.securityCode).toBe('123———');
            component.onPaste(paste('45'));
            expect(component.securityCode).toBe('45————');
            component.onPaste(paste('12345678'));
            expect(component.securityCode).toBe('123456');
        });

        it('should resend verification', () => {
            toast.show.calls.reset();
            service.sendVerificationCode.and.returnValue(of({}));
            component.resend();
            expect(toast.show).toHaveBeenCalled();
        });
    });
});
