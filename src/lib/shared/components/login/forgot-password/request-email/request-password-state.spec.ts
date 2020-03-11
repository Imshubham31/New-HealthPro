import { PasswordComponent } from '@lib/shared/components/reset-password/password.component';
import { LocaliseModule } from './../../../../../localise/localise.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { PasswordService } from '@lib/shared/components/reset-password/password.service';
import { ResetPasswordState } from '@lib/shared/components/login/forgot-password/request-email/request-password-state';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResetPasswordState', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, LocaliseModule],
            declarations: [PasswordComponent],
            providers: [
                {
                    provide: PasswordService,
                    useValue: jasmine.createSpyObj('passwordService', [
                        'resetPassword',
                    ]),
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    describe('updatePassword', () => {
        it('should call resetPassword the passwordService', () => {
            const passwordService = TestBed.get(PasswordService);
            const context = TestBed.createComponent(PasswordComponent)
                .componentInstance;
            const token = 'token';
            const newPassword = 'newPassword';
            context.form.get('confirmNewPassword').setValue(newPassword);
            new ResetPasswordState(token).updatePassword(context);
            expect(passwordService.resetPassword).toHaveBeenCalledWith(
                newPassword,
                token,
            );
        });
    });
});
