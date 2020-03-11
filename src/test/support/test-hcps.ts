import { Hcp } from '../../app/hcp/hcp.model';

export class TestHCPs {
    static build({
        id = 'hcp-65c5791a-4914-486b-a5f8-3e4fe3219e6f',
        name = 'Dr Random',
        isActive = true,
    } = {}): Hcp {
        const hcp = new Hcp();

        hcp.backendId = id;
        hcp.fullName = name;
        hcp.profilePictureUri = 'test';
        hcp.firstName = 'Diane';
        hcp.lastName = 'Collins';
        hcp.role = 'Surgeon';
        hcp.onboardingState = {
            hasConsented: true,
            hasUpdatedPassword: true,
            hasUpdatedProfilePicture: true,
        };
        hcp.isActive = isActive;
        hcp.language = 'en';
        hcp.dateFormat = 'dd/MM/yyyy';

        return hcp;
    }

    static createDrCollins(): Hcp {
        return TestHCPs.build({
            id: 'hcp-b7fb8cbf-a787-4562-902e-7518d5e997ad',
            name: 'Diane Collins',
        });
    }
}
