import { TestPatients } from './../../../../test/support/test-patients';
import { FormGroup } from '@angular/forms';
import { LocaliseModule } from './../../../../lib/localise/localise.module';
import { AppointmentFormFactory } from './appointment-form.factory';
import { AppointmentFormComponent } from './../appointment-form.component';
import { TestBed } from '@angular/core/testing';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { CreateAppointmentState } from '../states/create-appointment.state';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppointmentFormState } from '../states/appointment-form.state';
import { TestAppointments } from 'test/support/test-appointments';
import { UpdateAppointmentState } from '../states/update-appointment.state';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

@Component({
    selector: 'mock',
    template: '<p>mock</p>',
})
class MockComponent {
    static loadPatientsSpy = jasmine.createSpy('loadPatientsSpy');
    static setupPatientDetailsSpy = jasmine
        .createSpy('setupPatientDetailsSpy')
        .and.returnValue(of({}));
    state: AppointmentFormState;
    form: FormGroup;
    loadPatients() {
        return Observable.create(observer => {
            MockComponent.loadPatientsSpy();
            observer.next({});
            observer.complete();
        });
    }
    setupPatientDetails(participant: ParticipantDetails) {
        return MockComponent.setupPatientDetailsSpy(participant);
    }
}

describe('AppointmentFormFactory', () => {
    let component: AppointmentFormComponent;
    let factory: AppointmentFormFactory;
    let modalService: jasmine.SpyObj<ModalService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [
                AppointmentFormFactory,
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
            ],
            declarations: [AppointmentFormComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [AppointmentFormComponent],
            },
        });
    });
    beforeEach(() => {
        modalService = TestBed.get(ModalService);
        modalService.create.and.returnValue(new MockComponent());
        factory = TestBed.get(AppointmentFormFactory);
    });
    describe('makeCreateForm without patient', () => {
        beforeEach(() => (component = factory.makeCreateForm()));
        it('should use the CreateAppointmentState', () => {
            expect(component.state.constructor.name).toBe(
                CreateAppointmentState.name,
            );
        });
        it('should set the form without appointment', () => {
            expect(component.form).toBeDefined();
        });
    });
    describe('makeCreateForm with patient', () => {
        const patient = TestPatients.createEvaGriffiths();
        beforeEach(() => (component = factory.makeCreateForm(patient)));
        it('should use the CreateAppointmentState', () => {
            expect(component.state.constructor.name).toBe(
                CreateAppointmentState.name,
            );
        });
        it('should not loadPatients', () => {
            expect(MockComponent.loadPatientsSpy).not.toHaveBeenCalledTimes(1);
        });
        it('should set the form without an appointment', () => {
            expect(component.form).toBeDefined();
        });
        it('should set patient on the form', () => {
            expect(component.form.get('patient').value).toEqual(
                ParticipantDetails.map(patient),
            );
        });
        it('should disable the patient field', () => {
            expect(component.form.get('patient').disabled).toBe(true);
        });
        it('should call setupPatientDetails', () => {
            expect(MockComponent.setupPatientDetailsSpy).toHaveBeenCalledWith(
                ParticipantDetails.map(patient),
            );
        });
    });

    describe('makeUpdateForm with appointment', () => {
        const appointment = TestAppointments.createDietFollowUp();
        beforeEach(() => (component = factory.makeUpdateForm(appointment)));
        it('should use the UpdateAppointmentState', () => {
            expect(component.state.constructor.name).toBe(
                UpdateAppointmentState.name,
            );
        });
        it('should not loadPatients', () => {
            expect(MockComponent.loadPatientsSpy).not.toHaveBeenCalled();
        });
        it('should set the form with an appointment', () => {
            const value = component.form.getRawValue();
            expect(value.title).toEqual(appointment.title);
            expect(value.description).toEqual(appointment.description);
            expect(value.timeSpan).toEqual(appointment.timeSlot);
            expect(value.HCPs).toEqual(appointment.watcherDetails);
            expect(value.location).toEqual(appointment.location.name);
            expect(value.locationUrl).toEqual(appointment.location.url);
            expect(value.date).toEqual(appointment.date);
            expect(value.patient).toEqual(appointment.patientDetails);
        });
        it('should disable the patient field', () => {
            expect(component.form.get('patient').disabled).toBe(true);
        });
        it('should onPatientParticipantSelect', () => {
            expect(MockComponent.setupPatientDetailsSpy).toHaveBeenCalledWith(
                appointment.patientDetails,
            );
        });
    });
});
