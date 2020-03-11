import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { PatientService } from './../patient.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { DeletePatientModalComponent } from './delete-patient-modal.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { of, Observable } from 'rxjs';
import SpyObj = jasmine.SpyObj;

let component: DeletePatientModalComponent;
let fixture: ComponentFixture<DeletePatientModalComponent>;
const formBuilder: FormBuilder = new FormBuilder();
let patientService: SpyObj<PatientService>;
describe('DeletePatientModalComponent', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [DeletePatientModalComponent, ErrorPipe],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: ModalService,
                    useValue: {
                        create: () => ({
                            open: () => {},
                            onSuccess: of(),
                        }),
                    },
                },
                {
                    provide: ToastService,
                    useValue: jasmine.createSpyObj('ToastService', ['show']),
                },
                {
                    provide: PatientService,
                    useValue: jasmine.createSpyObj('patientService', [
                        'getPatients$',
                        'getPatient$',
                        'fetchPatients',
                        'deletePatient',
                    ]),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(DeletePatientModalComponent);
        component = fixture.componentInstance;
        component.patient = TestPatientOverview.build();
        component.modal = new ModalWrapperComponent();
        fixture.detectChanges();

        patientService = TestBed.get(PatientService);
    });
    it('should init', () => {
        expect(component).toBeDefined();
    });

    it('should open modal', () => {
        const spy = spyOn(component.modal, 'openModal').and.returnValue(
            () => {},
        );
        component.open();
        expect(spy).toHaveBeenCalled();
    });

    it('should close modal', () => {
        const spy = spyOn(component.modal, 'closeModal').and.returnValue(
            () => {},
        );
        component.close();
        expect(spy).toHaveBeenCalled();
    });

    it('should handle submit success', () => {
        const spy = spyOn(component.modal, 'closeModal').and.callFake(() => {});
        patientService.deletePatient.and.returnValue(of(true));
        component.submit();
        expect(spy).toHaveBeenCalled();
    });
    it('should handle submit fail', () => {
        patientService.deletePatient.and.returnValue(
            Observable.create(observer => observer.error({ error: 'error' })),
        );
        component.submit();
        expect(component.formError).toBe('error');
    });
});
