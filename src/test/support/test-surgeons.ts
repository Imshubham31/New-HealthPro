import { Surgeon } from 'app/patients/add-patient/surgery-details/surgeon.model';

export class TestSurgeons {
    static build(id = '1'): Surgeon {
        return new Surgeon(id, 'Catherine', 'Marston');
    }
}
