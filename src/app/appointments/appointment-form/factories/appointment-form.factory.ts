import { ModalService } from '@lib/shared/components/modal/modal.service';
import { Injectable } from '@angular/core';
import { Patient } from 'app/patients/patient.model';
import { AppointmentFormComponent } from '../appointment-form.component';
import { CreateAppointmentState } from '../states/create-appointment.state';
import { AppointmentFormModelFactory } from './appointment-form-model.factory';
import { Appointment } from '@lib/appointments/appointment.model';
import { UpdateAppointmentState } from '../states/update-appointment.state';
import * as cloneDeep from 'lodash/cloneDeep';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
@Injectable()
export class AppointmentFormFactory {
    constructor(private modalService: ModalService) {}

    makeCreateForm(patient?: Patient) {
        return patient
            ? this.makeCreateFormWithPatient(patient)
            : this.makeCreateFormWithoutPatient();
    }

    makeUpdateForm(appointment: Appointment) {
        const clone: Appointment = cloneDeep(appointment);
        const comp = this.modalService.create<AppointmentFormComponent>(
            AppointmentFormComponent,
        );
        comp.state = new UpdateAppointmentState(comp);
        comp.form = AppointmentFormModelFactory.createFormGroupFromAppointment(
            clone,
        );
        this.setupPatientDetails(comp, appointment.patientDetails);

        return comp;
    }

    private makeCreateFormWithoutPatient() {
        const comp = this.modalService.create<AppointmentFormComponent>(
            AppointmentFormComponent,
        );
        comp.state = new CreateAppointmentState(comp);
        comp.form = AppointmentFormModelFactory.createFormGroupFromAppointment();
        comp.form.get('HCPs').disable();

        return comp;
    }

    private makeCreateFormWithPatient(patient: Patient) {
        const comp = this.modalService.create<AppointmentFormComponent>(
            AppointmentFormComponent,
        );
        comp.state = new CreateAppointmentState(comp);
        comp.form = AppointmentFormModelFactory.createFormGroupFromAppointment();

        const patientDetails = ParticipantDetails.map(patient);
        comp.form.get('patient').setValue(patientDetails);
        this.setupPatientDetails(comp, patientDetails);

        return comp;
    }

    private setupPatientDetails(
        comp: AppointmentFormComponent,
        patientDetails: ParticipantDetails,
    ) {
        comp.patients = [patientDetails];
        comp.form.get('patient').disable();
        comp.setupPatientDetails(patientDetails);
    }
}
