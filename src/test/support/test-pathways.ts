import { Pathway } from '@lib/pathway/pathway.model';
import { TestSubPhases } from './test-sub-phases';

export class TestPathways {
    static build({ id = '42', description = 'description' } = {}): Pathway {
        const currentSubphaseId = '1';
        const currentPhaseId = '1';
        const subphaseTitle = 'Patient Registration';

        return {
            id,
            currentSubphaseId,
            currentPhaseId,
            title: 'Pathway Title',
            phases: [
                {
                    id: currentPhaseId,
                    description,
                    templateRevision: '',
                    order: 0,
                    subphases: [
                        TestSubPhases.create({ id: currentSubphaseId }),
                    ],
                    title: 'Phase Title',
                },
                {
                    id: '2',
                    description,
                    templateRevision: '',
                    order: 1,
                    subphases: [TestSubPhases.create({ title: subphaseTitle })],
                    title: 'Next Phase Title',
                },
            ],
        };
    }
}
