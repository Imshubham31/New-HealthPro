import { AppointmentFormComponent } from './../appointment-form.component';
import { CreateAppointmentState } from './create-appointment.state';
import { AppointmentFormState } from './appointment-form.state';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SharedModalComponentsModule } from '@lib/shared/components/modal/modal.module';
import { AppointmentsService } from 'app/appointments/appointments.service';
import { PatientService } from 'app/patients/patient.service';
import { HcpService } from 'app/hcp/hcp.service';
import { PathWayService } from '@lib/pathway/pathway.service';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppointmentFormModelFactory } from '../factories/appointment-form-model.factory';
import { TestAppointments } from 'test/support/test-appointments';
import { UpdateAppointmentState } from './update-appointment.state';

xdescribe('AppointmentFormState', () => {
    let state: AppointmentFormState;
    const appointment = TestAppointments.createDietFollowUp();
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
        spyOn(
            AppointmentFormModelFactory,
            'formGroupToAppointment',
        ).and.returnValue(appointment);
    });
    describe('CreateAppointmentState', () => {
        beforeEach(() => {
            state = new CreateAppointmentState(
                TestBed.createComponent(
                    AppointmentFormComponent,
                ).componentInstance,
            );
        });
        it('should have the title "newAppointment"', () => {
            expect(state.titleTextKey).toBe('newAppointment');
        });
        it('should have submit button text "createAppointmentButton"', () => {
            expect(state.submitButtonTextKey).toBe('createAppointmentButton');
        });

        describe('submit', () => {
            it('should call save appointment for creation', () => {
                const service = TestBed.get(AppointmentsService);
                state.submit();
                expect(service.saveAppointment).toHaveBeenCalledWith(
                    appointment,
                    true,
                );
            });
        });
    });
    describe('UpdateAppointmentState', () => {
        beforeEach(() => {
            state = new UpdateAppointmentState(
                TestBed.createComponent(
                    AppointmentFormComponent,
                ).componentInstance,
            );
        });
        it('should have the title "updateAppointment"', () => {
            expect(state.titleTextKey).toBe('updateAppointment');
        });
        it('should have submit button text "updateAppointmentButton"', () => {
            expect(state.submitButtonTextKey).toBe('updateAppointmentButton');
        });

        describe('submit', () => {
            it('should call save appointment for creation', () => {
                const service = TestBed.get(AppointmentsService);
                state.submit();
                expect(service.saveAppointment).toHaveBeenCalledWith(
                    appointment,
                    false,
                );
            });
        });
    });
});
