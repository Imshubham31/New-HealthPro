import { AuthenticationService } from '@lib/authentication/authentication.service';
import { UserUnitsPipe } from './userUnits.pipe';
import { TestBed, inject } from '@angular/core/testing';
import { UnitsUtils } from '@lib/utils/units-utils';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';

let userUnits: UserUnitsPipe;

describe('UserUnitsPipe', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [LocaliseService, UnitsUtils, LANGUAGE_PROVIDERS],
        });
    });

    beforeEach(inject([LocaliseService], (localiseService: LocaliseService) => {
        localiseService.use('en');
        const unitUtils = new UnitsUtils(localiseService);
        userUnits = new UserUnitsPipe(unitUtils);
    }));

    it('should print weight as metric', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            units: 'metric',
        });
        expect(userUnits.transform(1.001, 'weight')).toBe('1');
    });

    it('should print weight as imperial', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            units: 'imperial',
        });
        expect(userUnits.transform(1, 'weight')).toBe('2.2');
    });

    it('should print height as metric', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            units: 'metric',
        });
        expect(userUnits.transform(100.001, 'height')).toBe('100');
    });

    it('should print height as imperial', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            units: 'imperial',
        });
        expect(userUnits.transform(100.001, 'height')).toBe(`3'3"`);
    });

    it('should return null', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            units: 'metric',
        });
        expect(userUnits.transform(undefined, 'weight')).toBeNull();
        expect(userUnits.transform(null, 'weight')).toBeNull();
    });
});
