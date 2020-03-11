import { LocaliseModule } from '@lib/localise/localise.module';
import { PasswordConfirmationModalComponent } from './password-confirmation-modal.component';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

let component: PasswordConfirmationModalComponent;
let fixture: ComponentFixture<PasswordConfirmationModalComponent>;

describe('Password Confirmation Modal Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [PasswordConfirmationModalComponent],
            providers: [
                ModalWrapperComponent,
                {
                    provide: Router,
                    useValue: {
                        navigate: val => val,
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(PasswordConfirmationModalComponent);
        component = fixture.componentInstance;
        (component as any).modal = {
            openModal: () => {},
            closeModal: () => {},
        };
        fixture.detectChanges();
    });
    it('should open modal', () => {
        const spy = spyOn(component.modal, 'openModal');
        component.open();
        expect(spy).toHaveBeenCalled();
    });
    it('should close modal', () => {
        const spy = spyOn(component.modal, 'closeModal');
        component.close();
        expect(spy).toHaveBeenCalled();
    });
});
