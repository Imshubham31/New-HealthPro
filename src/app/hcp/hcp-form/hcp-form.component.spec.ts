import { CreateHcpState } from './create-hcp.state';
import { HcpService } from './../hcp.service';
import { FormBuilder } from '@angular/forms';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { HcpFormComponent } from './hcp-form.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@lib/shared/components/toast/toast.service';

let component: HcpFormComponent;
let fixture: ComponentFixture<HcpFormComponent>;
const formBuilder: FormBuilder = new FormBuilder();
describe('Hcp form component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [HcpFormComponent, ErrorPipe],
            providers: [
                ModalWrapperComponent,
                {
                    provide: Router,
                    useValue: {
                        navigate: val => val,
                    },
                },
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: HcpService,
                    useValue: {},
                },
                {
                    provide: ToastService,
                    useValue: {
                        show: () => {},
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(HcpFormComponent);
        component = fixture.componentInstance;
        (component as any).modal = {
            openModal: () => {},
            closeModal: () => {},
        };
        component.state = new CreateHcpState();
        (component as any).reset = () => {};
        component.state.context = component;
        component.state.setupForm();
        fixture.detectChanges();
    });
    it('should open and close', () => {
        const closeModalSpy = spyOn((component as any).modal, 'closeModal');
        component.finish();
        expect(closeModalSpy).toHaveBeenCalled();
        const spy = spyOn(component.modal, 'openModal');
        component.open();
        expect(spy).toHaveBeenCalled();
    });
    it('should test hasRole', () => {
        component.form.value[component.roleRadioControl] = 'existingValues';
        expect(component.hasRole()).toBeFalsy();
        component.form.value[component.roleRadioControl] = 'nonExistingValues';
        component.form.value.otherRole = true;
        expect(component.hasRole()).toBeTruthy();
    });
});
