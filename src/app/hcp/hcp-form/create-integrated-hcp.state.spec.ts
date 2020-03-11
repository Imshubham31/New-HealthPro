import { AuthenticationService } from './../../../lib/authentication/authentication.service';
import { CreateIntegratedHcpState } from './create-integrated-hcp.state';
import { TestHCPs } from 'test/support/test-hcps';

describe('Create Integrated HCP State', () => {
    let instance;
    const mockHcp = TestHCPs.createDrCollins();
    beforeEach(() => {
        instance = new CreateIntegratedHcpState();
        instance.context = {
            form: {
                value: mockHcp,
            },
        };
    });
    it('should build hcp', () => {
        spyOn(AuthenticationService, 'getUser').and.callFake(() => ({
            hospitalId: 1,
        }));
        expect((instance as any).buildHcp().hospitalId).toBe(1);
    });
    it('should build controls', () => {
        expect((instance as any).buildControls().mrn).toBeDefined();
    });
});
