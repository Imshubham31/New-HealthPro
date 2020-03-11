import { CareModuleModel } from '../../app/patients/add-patient/care-module/care-module.model';

export class TestCareModules {
    static build(id = '42'): CareModuleModel {
        return {
            id,
            description: 'Lorem ipsum',
            pathwayId: '42',
            title: 'Lorem ipsum',
        };
    }
}
