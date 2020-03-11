import { MDT } from '../../app/mdt/mdt.model';
import { TestHCPs } from './test-hcps';
import { MDTs } from 'app/mdts/mdts.model';

export class TestMDTs {
    static build({ patientId }): MDT[] {
        return [
            {
                hcps: [TestHCPs.createDrCollins()],
                id: '42',
                name: 'Team',
                hospitalId: 'hpid',
                personal: false,
                patientId,
            },
        ] as any;
    }

    static buildMdts(props?: any): MDTs {
        return {
            id: 'mdt-001',
            hcps: [TestHCPs.createDrCollins()],
            name: 'Team',
            hospitalId: 'hpid',
            personal: false,
            ...props,
        };
    }
}
