import { PatientOverview } from '../../app/patients/view-patient.model';
import { TestPatients } from './test-patients';
import { TestCareModules } from './test-caremodules';

export class TestPatientOverview {
    static build({ withMdt = false } = {}): PatientOverview {
        return {
            patient: TestPatients.createEvaGriffiths({ withMdt }),
            careModule: TestCareModules.build(),
        };
    }
}
