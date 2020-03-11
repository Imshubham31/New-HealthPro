import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTempFormComponent } from './message-temp-form.component';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { Localise } from '@lib/localise/localise.pipe';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { HttpClientModule } from '@angular/common/http';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { Languages } from '@lib/localise/languages';
import { ToastService } from '@lib/shared/components/toast/toast.service';

describe('MessageTempFormComponent', () => {
    let component: MessageTempFormComponent;
    let fixture: ComponentFixture<MessageTempFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, HttpClientModule],
            declarations: [
                MessageTempFormComponent,
                ModalWrapperComponent,
                Localise,
                ErrorPipe,
            ],
            providers: [
                FormBuilder,
                {
                    provide: HospitalsRestService,
                    useClass: HospitalsRestService,
                },
                { provide: LocaliseService, useClass: LocaliseService },
                { provide: ToastService, useClass: ToastService },
                {
                    provide: Languages,
                    useValue: { en: '' },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageTempFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open modal', () => {
        expect(component).toBeDefined();
        (component as any).state = {
            context: undefined,
            title: '',
            submitButtonText: '',
            submit: () => {},
            setupForm: () => {},
        };
        const spy = spyOn(component.modal, 'openModal');
        component.open();
        expect(spy).toHaveBeenCalled();
    });

    it('should close and clean form on finish', () => {
        const cleanFormSpy = spyOn(component, 'cleanForm');
        const closeModalSpy = spyOn((component as any).modal, 'closeModal');
        component.finish();
        expect(cleanFormSpy).toHaveBeenCalled();
        expect(closeModalSpy).toHaveBeenCalled();
    });
});
