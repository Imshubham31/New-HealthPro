import { AuthenticationService } from './../../../lib/authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { PasswordUtils } from './../../../lib/utils/password-utils';
import { ModalWrapperComponent } from './../../../lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { PasswordService } from './../../../lib/shared/components/reset-password/password.service';
import { ChangePasswordComponent } from './change-password.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorPipe } from '@lib/shared/services/error.pipe';

let component: ChangePasswordComponent;
let fixture: ComponentFixture<ChangePasswordComponent>; // create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('Change Password Component', () => {
    const mockTostService = {
        show: () => {},
    };
    const mockModal: ModalWrapperComponent = {
        openModal: () => {
            this.modalActive = true;
        },
        closeModal: () => {
            this.modalActive = false;
        },
        modalTitle: 'mockModalTitle',
        modalSubTitle: 'mockModalSubTitle',
        modalActive: false,
        modalWidth: '500px',
        modalBodyMaxHeight: '500px',
        showCloseBtn: true,
        modalFooter: null,
        onCloseModal: null,
        onOpenModal: null,
        callDestroy: () => {},
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule, ReactiveFormsModule],
            declarations: [ChangePasswordComponent, ErrorPipe],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: PasswordService,
                    useValue: {
                        changePassword: of(),
                    },
                },
                { provide: ToastService, useValue: mockTostService },
                PasswordUtils,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        component.setupForm();
        component.modal = mockModal;
        fixture.detectChanges();
    });
    it('should open modal', () => {
        spyOn(component.modal, 'openModal');
        component.open();
        expect(component.modal.openModal).toHaveBeenCalled();
    });
    it('should close modal', () => {
        component.hasSubmittedOnce = true;
        spyOn(component.modal, 'closeModal');
        component.close();
        expect(component.modal.closeModal).toHaveBeenCalled();
        expect(component.hasSubmittedOnce).toBeFalsy();
    });
    describe('Behaviours', () => {
        function setPasswords(
            newPass: String,
            oldPass: String,
            wrongPass: Boolean = false,
        ) {
            component.form.controls['oldPassword'].setValue(oldPass);
            component.form.controls['newPassword'].setValue(newPass);
            component.form.controls['confirmNewPassword'].setValue(
                wrongPass ? 'wrong' : newPass,
            );
            component.submit();
        }
        it('should disable submit if passwords dont mach', () => {
            spyOn(
                (component as any).passwordService,
                'changePassword',
            ).and.returnValue(of(true));
            setPasswords('newPassword1', '', true);
            expect(
                (component as any).passwordService.changePassword,
            ).not.toHaveBeenCalled();
        });
        it('should disable submit if password is to simple', () => {
            spyOn(
                (component as any).passwordService,
                'changePassword',
            ).and.returnValue(of(true));
            setPasswords('1', '');
            expect(
                (component as any).passwordService.changePassword,
            ).not.toHaveBeenCalled();
        });
        it('should submit if passwords are ok and handle success', () => {
            spyOn((component as any).toastService, 'show');
            spyOn(
                (component as any).passwordService,
                'changePassword',
            ).and.returnValue(of(true));
            setPasswords('newPassword1', 'oldPassword');
            expect(
                (component as any).passwordService.changePassword,
            ).toHaveBeenCalled();
            expect((component as any).toastService.show).toHaveBeenCalled();
        });
        it('should submit if passwords are ok and handle unknown error', () => {
            const newError = {
                error: {
                    code: 500,
                    message: 'ups',
                    system: 'string',
                },
                status: 500,
            };
            component.error = null;
            spyOn(
                (component as any).passwordService,
                'changePassword',
            ).and.returnValue(Observable.throw(newError));
            setPasswords('newPassword1', 'oldPassword');
            expect(
                (component as any).passwordService.changePassword,
            ).toHaveBeenCalled();
            expect(component.error).toBe(newError.error);
        });
        it('should submit if passwords are ok and handle 403 error', () => {
            const newError = {
                error: {
                    code: 403,
                    message: 'ups',
                    system: 'string',
                },
                status: 403,
            };
            component.error = null;
            spyOn(
                (component as any).passwordService,
                'changePassword',
            ).and.returnValue(Observable.throw(newError));
            spyOn(AuthenticationService, 'logout');
            setPasswords('newPassword1', 'oldPassword');
            expect(
                (component as any).passwordService.changePassword,
            ).toHaveBeenCalled();
            expect(component.error).toBe(newError.error);
            expect(AuthenticationService.logout).toHaveBeenCalled();
        });
    });
});
