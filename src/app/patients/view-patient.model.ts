import { Patient } from './patient.model';
import { CareModuleModel } from './add-patient/care-module/care-module.model';

export class PatientOverview {
    patient: Patient;
    careModule: CareModuleModel | null;
    hospitalId?: string;

    static get searchFields() {
        return ['patient.fullName', 'careModule.title'];
    }
}
