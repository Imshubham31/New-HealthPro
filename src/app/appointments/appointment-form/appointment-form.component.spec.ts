import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import SpyObj = jasmine.SpyObj;

import { TestHCPs } from 'test/support/test-hcps';
import { TestPatients } from 'test/support/test-patients';
import { LocaliseModule } from '@lib/localise/localise.module';
import { PatientService } from '../../patients/patient.service';
import { SharedModalComponentsModule } from '@lib/shared/components/modal/modal.module';
import { AppointmentsService } from '../appointments.service';
import { HcpService } from '../../hcp/hcp.service';
import { TestPathways } from 'test/support/test-pathways';
import { PathWayService } from '@lib/pathway/pathway.service';
import { of } from 'rxjs';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { Stores } from '@lib/utils/stores';
import { Appointment } from '@lib/appointments/appointment.model';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { AppointmentFormComponent } from './appointment-form.component';
import { AppointmentFormModelFactory } from './factories/appointment-form-model.factory';
import { AppointmentFormState } from './states/appointment-form.state';
import { BaseForm } from '@lib/shared/services/base-form';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

class MockState implements AppointmentFormState {
    readonly titleTextKey = 'titleTextKey';
    readonly submitButtonTextKey = 'submitButtonTextKey';
    constructor(readonly context: AppointmentFormComponent & BaseForm) {}
    submit() {
        return of();
    }
}

xdescribe('AppointmentFormComponent', () => {
    let component: AppointmentFormComponent;
    let fixture: ComponentFixture<AppointmentFormComponent>;
    let service: SpyObj<AppointmentsService>;
    let patientService: SpyObj<PatientService>;
    let pathwayService: SpyObj<PathWayService>;
    let hcpService: SpyObj<HcpService>;
    let appointmentsStore: BehaviorSubject<Stores.Store<Appointment>>;
    const patients = [TestPatientOverview.build({ withMdt: true })];

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                LocaliseModule,
                SharedModalComponentsModule,
            ],
            declarations: [AppointmentFormComponent],
            providers: [
                {
                    provide: AppointmentsService,
                    useValue: jasmine.createSpyObj('appointmentService', [
                        'saveAppointment',
                        'resetErrors',
                        'getAppointments$',
                    ]),
                },
                {
                    provide: PatientService,
                    useValue: jasmine.createSpyObj('patientService', [
                        'getPatients$',
                        'getPatient$',
                        'fetchPatients',
                        'fetchPatientWithId',
                    ]),
                },
                {
                    provide: HcpService,
                    useValue: jasmine.createSpyObj('hcpService', [
                        'getHCPs$',
                        'fetchHcps',
                    ]),
                },
                {
                    provide: PathWayService,
                    useValue: jasmine.createSpyObj('pathwayService', [
                        'getPathwayById$',
                        'fetchPathway',
                    ]),
                },
                RestrictProcessingPipe,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        service = TestBed.get(AppointmentsService);
        patientService = TestBed.get(PatientService);
        pathwayService = TestBed.get(PathWayService);
        hcpService = TestBed.get(HcpService);

        appointmentsStore = new BehaviorSubject({
            list: [],
            isSaving: false,
            isFetching: false,
            isDeleting: false,
            errors: [],
        });

        service.saveAppointment.and.returnValue(of({}));
        service.getAppointments$.and.returnValue(appointmentsStore);
        patientService.getPatients$.and.returnValue(
            of({
                isFetching: false,
                list: patients,
            }),
        );
        patientService.getPatient$.and.returnValue(of(patients[0]));
        patientService.fetchPatientWithId.and.returnValue(of(patients[0]));
        patientService.fetchPatients.and.returnValue(of(patients));
        hcpService.getHCPs$.and.returnValue(of());
        hcpService.fetchHcps.and.returnValue(of());
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentFormComponent);
        component = fixture.componentInstance;
        component.state = new MockState(component);
        component.form = AppointmentFormModelFactory.createFormGroupFromAppointment();
        component.modal = new ModalWrapperComponent();
        fixture.detectChanges();
    });

    afterEach(() => {
        service.resetErrors.calls.reset();
        patientService.fetchPatients.calls.reset();
        patientService.getPatient$.calls.reset();
    });

    describe('errors$', () => {
        it('should get the errors from the store', done => {
            const erredStore = {
                ...appointmentsStore.value,
                errors: ['test'],
            };
            service.getAppointments$.and.returnValue(of(erredStore));
            component.errors$.subscribe(errors => {
                expect(errors).toEqual(erredStore.errors);
                done();
            });
        });
    });

    describe('hcpLabelFormatter', () => {
        it('should format the hcp label', () => {
            const hcp = TestHCPs.createDrCollins();
            expect(component.hcpLabelFormatter(hcp)).toBe(
                `${hcp.firstName} ${hcp.lastName}`,
            );
        });
    });

    describe('open', () => {
        it('should open the modal', () => {
            const spy = spyOn(component.modal, 'openModal');
            component.open();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should reset the errors on the service', () => {
            component.open();
            expect(service.resetErrors).toHaveBeenCalledTimes(1);
        });
        it('should enable locationUrl if includeLinkToLocation checkbox is clicked', () => {
            component.open();
            expect(component.form.get('locationUrl').disabled).toBe(true);
            component.form.get('includeLinkToLocation').setValue(true);
            expect(component.form.get('locationUrl').disabled).toBe(false);
        });
    });

    describe('close', () => {
        it('should clean the form', () => {
            component.close();
            expect(component.form.pristine).toBe(true);
        });
        it('should close the modal', () => {
            const spy = spyOn(component.modal, 'closeModal');
            component.close();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should reset the errors on the service', () => {
            component.close();
            expect(service.resetErrors).toHaveBeenCalledTimes(1);
        });
    });

    describe('submit', () => {
        it('should call submit on the state', () => {
            const spy = spyOn(component.state, 'submit').and.returnValue(of());
            component.submit();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('setupPatientDetails', () => {
        const pathway = TestPathways.build();
        beforeEach(() => {
            pathwayService.getPathwayById$.and.returnValue(of(pathway));
            pathwayService.fetchPathway.and.returnValue(of(pathway));
        });
        it('should get the patients', () => {
            component.setupPatientDetails(
                ParticipantDetails.map(patients[0].patient),
            );
            expect(patientService.getPatient$).toHaveBeenCalledWith(
                patients[0].patient.backendId,
            );
        });
        it('should set the hcps', done => {
            component.setupPatientDetails(
                ParticipantDetails.map(patients[0].patient),
            );
            component.HCPs.forEach((participant, i) => {
                expect(participant).toEqual(
                    ParticipantDetails.map(patients[0].patient.mdts[0].hcps[i]),
                );
                done();
            });
        });
        it('should set selected patient', () => {
            component.setupPatientDetails(
                ParticipantDetails.map(patients[0].patient),
            );
            expect(component.selectedPatient).toEqual(patients[0]);
        });
    });

    describe('handlePatientChange', () => {
        it('should clear existing HCPs', () => {
            component.form.get('HCPs').setValue([TestHCPs.createDrCollins()]);
            component.handlePatientChange(
                ParticipantDetails.map(patients[0].patient),
            );
            expect(component.form.get('HCPs').value).toEqual([]);
        });
    });

    describe('patientLabelFormatter', () => {
        it('should return the name', () => {
            const participant = ParticipantDetails.map(
                TestPatients.createEvaGriffiths(),
            );
            expect(component.patientLabelFormatter(participant)).toBe(
                `${participant.firstName} ${participant.lastName}`,
            );
        });
    });

    describe('getHcps', () => {
        it('should get hcps from patient overview', done => {
            const patient = TestPatientOverview.build({ withMdt: true });
            component.getMDTsHcps(patient).forEach((participant, i) => {
                expect(participant).toEqual(
                    ParticipantDetails.map(patient.patient.mdts[0].hcps[i]),
                );
                done();
            });
        });
        it('should get empty array if no mdt', () => {
            const patient = TestPatientOverview.build();
            expect(component.getMDTsHcps(patient)).toEqual([]);
        });
        it('should get empty array if mdt has no hcps', () => {
            const patient = TestPatientOverview.build({ withMdt: true });
            patient.patient.mdts[0].hcps = [];
            expect(component.getMDTsHcps(patient)).toEqual([]);
        });
    });

    describe('setHcps', () => {
        it('should set hcps from patient overview', done => {
            const patient = TestPatientOverview.build({ withMdt: true });
            component.setHcps(patient);
            component.HCPs.forEach((participant, i) => {
                expect(participant).toEqual(
                    ParticipantDetails.map(patient.patient.mdts[0].hcps[i]),
                );
                done();
            });
        });
        it('should not set hcps if patient is undefined', () => {
            component.setHcps();
            expect(component.HCPs).toEqual([]);
        });
    });
});
