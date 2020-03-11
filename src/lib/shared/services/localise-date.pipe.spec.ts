import { TestBed, inject } from '@angular/core/testing';
import { UnitsUtils } from '@lib/utils/units-utils';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';

let pipe: LocalisedDatePipe;

describe('LocalisedDatePipe', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [LocaliseService, UnitsUtils, LANGUAGE_PROVIDERS],
        });
    });

    beforeEach(inject([LocaliseService], (localiseService: LocaliseService) => {
        localiseService.use('en');
        pipe = new LocalisedDatePipe(localiseService);
    }));

    it('should transform date string to localised', () => {
        const date = new Date('2012-12-12');
        expect(pipe.transform(date.toISOString())).toBe('Dec 12, 2012');
    });

    // TODO:    Investigate if this test is needed anymore. There were perfromance issues highlighed around Number(digit).toLocaleString().
    //          However, using LocalisedDatePipe as a pure filter alleviated any issues.
    it('should transform 100 date strings to localised in under 100 seconds', () => {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            const date = new Date('2012-12-12');
            pipe.transform(date.toISOString());
        }
        expect(performance.now() - start).toBeLessThan(1000);
    });
});
