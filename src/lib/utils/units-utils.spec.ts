import { AuthenticationService } from '@lib/authentication/authentication.service';
import { UnitsUtils } from './units-utils';
import { TestBed, inject } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';

let unitUtils: UnitsUtils;

describe('UnitUtils', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [LocaliseService, LANGUAGE_PROVIDERS],
        });
    });

    beforeEach(inject([LocaliseService], (localiseService: LocaliseService) => {
        localiseService.use('en');
        unitUtils = new UnitsUtils(localiseService);
    }));

    describe('metric', () => {
        beforeAll(() =>
            spyOn(AuthenticationService, 'getUser').and.returnValue({
                units: 'metric',
            }),
        );

        it('should get weight unit', () =>
            expect(unitUtils.weightUnit).toBe('kg'));

        it('should get height unit', () =>
            expect(unitUtils.heightUnit).toBe('cm'));

        it('should format weight', () =>
            expect(UnitsUtils.formatWeight(1.001)).toBe(1.001));

        it('should format height', () =>
            expect(UnitsUtils.formatHeight('100.001')).toBe(100));

        it('should convert weight', () =>
            expect(unitUtils.convertWeight(1.001)).toBe('1'));

        it('should convert height', () =>
            expect(unitUtils.convertHeight(100.001)).toBe('100'));
    });

    describe('imperial', () => {
        beforeAll(() =>
            spyOn(AuthenticationService, 'getUser').and.returnValue({
                units: 'imperial',
            }),
        );

        it('should get weight unit', () =>
            expect(unitUtils.weightUnit).toBe('lb'));

        it('should get height unit', () =>
            expect(unitUtils.heightUnit).toBe(''));

        it('should format weight', () =>
            expect(UnitsUtils.formatWeight(1.001)).toBe(0.4540459623800454));

        it('should format height', () =>
            expect(UnitsUtils.formatHeight(`6'0"`)).toBe(182.88));

        it('should format arabic height', () =>
            expect(UnitsUtils.formatHeight(`٦'٠"`)).toBe(182.88));

        it('should convert weight', () =>
            expect(unitUtils.convertWeight(1.001)).toBe('2.21'));

        it('should convert height', () =>
            expect(unitUtils.convertHeight(100.001)).toBe(`3'3"`));
    });
});
