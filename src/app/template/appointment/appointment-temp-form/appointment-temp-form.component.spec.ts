import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTempFormComponent } from './appointment-temp-form.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from 'app/template/appointment.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';

describe('AppointmentTempFormComponent', () => {
    let component: AppointmentTempFormComponent;
    let fixture: ComponentFixture<AppointmentTempFormComponent>;
    const formBuilder: FormBuilder = new FormBuilder();
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                LocaliseModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
            ],
            declarations: [AppointmentTempFormComponent, ErrorPipe],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                AppointmentService,
                LocaliseService,
                ToastService,
                HospitalsRestService,
                ModalWrapperComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentTempFormComponent);
        component = fixture.componentInstance;
        (component as any).state = {
            reset: () => {},
            setupForm: () => {},
            context: component,
        };
        component.modal = mockModal;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open modal', () => {
        spyOn(component.modal, 'openModal');
        component.open();
        expect(component.modal.openModal).toHaveBeenCalled();
    });
    it('should close modal', () => {
        spyOn(component, 'cleanForm');
        spyOn(component.modal, 'closeModal');
        component.close();
        expect(component.modal.closeModal).toHaveBeenCalled();
    });
    it('should finish modal', () => {
        spyOn(component, 'close');
        component.close();
        expect(component.close).toHaveBeenCalled();
    });
    it('should shouldDisableSubmit called', () => {
        component.form = jasmine.createSpyObj('form', ['valid']);
        expect(component.shouldDisableSubmit()).toBeFalsy();
    });
    it('should finish modal', () => {
        spyOn(component, 'close');
        component.finish();
        expect(component.close).toHaveBeenCalled();
    });
    it('should cleanForm modal', () => {
        spyOn(component, 'cleanForm');
        component.cleanForm();
        expect(component.errors.length).toBe(0);
    });
});
