import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

let component: ConfirmationDialogComponent;
let fixture: ComponentFixture<ConfirmationDialogComponent>;

describe('Confirmation Dialog Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ConfirmationDialogComponent],
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
        fixture = TestBed.createComponent(ConfirmationDialogComponent);
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
        const spy = spyOn(component.onClose, 'next');
        component.handleYes();
        expect(spy).toHaveBeenCalledWith(true);
        spy.calls.reset();
        component.handleNo();
        expect(spy).toHaveBeenCalledWith(false);
    });
});
