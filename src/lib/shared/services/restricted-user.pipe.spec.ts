import { TestBed } from '@angular/core/testing';
import { RestrictProcessingPipe } from './restricted-user.pipe';
import { TestHCPs } from 'test/support/test-hcps';
import { LocaliseService } from '@lib/localise/localise.service';

describe('restrict processing pipe', () => {
    let user;
    let restrictProcessingPipe;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: key => key,
                        fromParams: (key, params) => `${key} ${params[0]}`,
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        user = TestHCPs.createDrCollins();
        restrictProcessingPipe = new RestrictProcessingPipe(
            TestBed.get(LocaliseService),
        );
    });

    it('should display hcp that is not restricted regularly', () => {
        expect(restrictProcessingPipe.transform(user)).toBe('Diane Collins');
    });

    it('should display default text if hcp is restricted', () => {
        user.isRestricted = true;
        expect(restrictProcessingPipe.transform(user)).toBe(
            `assignedRole ${user.role}`,
        );
    });

    it('should display unkownUser for no value', () => {
        expect(restrictProcessingPipe.transform()).toBe(`unknownUser`);
    });
});
