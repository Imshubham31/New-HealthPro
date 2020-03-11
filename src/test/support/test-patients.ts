import { Patient } from '../../app/patients/patient.model';
import { TestPathways } from './test-pathways';
import { TestMDTs } from './test-mdts';

export class TestPatients {
    static createEvaGriffiths({ withMdt = false } = {}) {
        const backendId = 'patient-4d01f07a-ed63-430e-afc3-3f3b8505b737';
        return TestPatients.build({
            backendId,
            firstName: 'Eva',
            lastName: 'Griffiths',
            hospitalId: '1',
            pathway: TestPathways.build({ id: '1' }),
            mdt: withMdt ? TestMDTs.build({ patientId: backendId }) : null,
        });
    }

    static build(
        {
            backendId = 'patient-42',
            firstName = 'random',
            lastName = 'random',
            hospitalId = '42',
            pathway = TestPathways.build(),
            mdts = TestMDTs.build({ patientId: 'patient-42' }),
        } = {} as any,
    ): Patient {
        return {
            height: 100,
            backendId,
            firstName,
            lastName,
            idmsId: 1,
            fullName: `${firstName} ${lastName}`,
            nickname: '',
            email: '',
            phoneNumber: '',
            optOut: false,
            optOutDatetime: '',
            gender: 'female',
            careModuleId: '',
            dob: new Date(Date.UTC(1985, 6, 10)).toUTCString(),
            units: '',
            language: 'en',
            dateFormat: 'dd/MM/yyyy',
            firstDayOfWeek: 'tuesday',
            pathwayId: Number(pathway.id),
            surgery: {
                startDateTime: new Date(2022, 1, 1),
                surgeon: {
                    id: 'hcp-47f3a288-9d2d-496b-a1ca-4ecb58cb2e49',
                    firstName: 'New HCP',
                    lastName: 'New',
                    role: 'Surgeon',
                },
            },
            hospitalId,
            hasCompletedOnboarding: true,
            onboardingState: {
                hasConsented: true,
                hasUpdatedPassword: true,
                hasUpdatedProfilePicture: true,
            },
            documentsAccepted: [
                { key: 'test', revision: '1', documentId: '42' },
                { key: 'test', revision: '1', documentId: '42' },
                { key: 'test', revision: '1', documentId: '42' },
            ],
            mdts,
        };
    }
}
