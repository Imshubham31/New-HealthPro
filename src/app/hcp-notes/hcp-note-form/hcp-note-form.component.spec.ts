import { HcpNotesService } from 'app/hcp-notes/hcp-notes.service';
import { CountdownPipe } from '@lib/shared/services/countdown.pipe';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { HcpNoteFormComponent } from './hcp-note-form.component';

import { FormBuilder } from '@angular/forms';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@lib/shared/components/toast/toast.service';

let component: HcpNoteFormComponent;
let fixture: ComponentFixture<HcpNoteFormComponent>;

describe('Hcp note form component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [
                HcpNoteFormComponent,
                ErrorPipe,
                LocalisedDatePipe,
                CountdownPipe,
            ],
            providers: [
                ModalWrapperComponent,
                {
                    provide: Router,
                    useValue: {
                        navigate: val => val,
                    },
                },
                {
                    provide: HcpNotesService,
                    useValue: {},
                },
                FormBuilder,
                {
                    provide: ToastService,
                    useValue: {
                        show: () => {},
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(HcpNoteFormComponent);
        component = fixture.componentInstance;
        (component as any).state = {};
        (component as any).modal = {
            openModal: () => {},
            closeModal: () => {},
        };
        fixture.detectChanges();
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
    it('should handleCancel', () => {
        (component as any).state = {
            context: {
                form: {
                    pristine: false,
                },
            },
        };
        const closeModalSpy = spyOn((component as any).modal, 'closeModal');
        component.handleCancel();
        expect(closeModalSpy).not.toHaveBeenCalled();
        (component as any).state = {
            context: {
                form: {
                    pristine: true,
                },
            },
        };
        component.handleCancel();
        expect(closeModalSpy).toHaveBeenCalled();
    });
    it('should handleConfirmation', () => {
        const closeModalSpy = spyOn((component as any).modal, 'closeModal');
        component.handleConfirmation(false);
        expect(closeModalSpy).not.toHaveBeenCalled();
        component.handleConfirmation(true);
        expect(closeModalSpy).toHaveBeenCalled();
    });
    it('should get body', () => {
        (component as any).state = {
            context: {
                form: {
                    value: {
                        body: '123',
                    },
                },
            },
        };
        expect(component.body).toBe('123');
    });
    it('should get body as empty string if form not defined', () => {
        (component as any).state = {
            context: {},
        };
        expect(component.body).toBe('');
    });
    it('should get body as empty string if body not defined', () => {
        (component as any).state = {
            context: {
                form: {
                    value: {},
                },
            },
        };
        expect(component.body).toBe('');
    });
});
