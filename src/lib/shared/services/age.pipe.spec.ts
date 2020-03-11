import { AgePipe } from './age.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { TestBed, inject } from '@angular/core/testing';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';

let agePipe: AgePipe;

describe('Age pipe', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [LocaliseService, LANGUAGE_PROVIDERS],
        });
    });

    beforeEach(inject([LocaliseService], (localiseService: LocaliseService) => {
        localiseService.use('en');
        agePipe = new AgePipe(localiseService);
    }));

    it('should convert timestamp to age string', () => {
        let testAge = Date.now() - 1000 * 60 * 60 * 24 * 365.25;
        expect(agePipe.transform(new Date(testAge).toISOString())).toBe(
            '1 years',
        );

        testAge = testAge - 1000 * 60 * 60 * 24 * 365.25;
        expect(agePipe.transform(new Date(testAge).toISOString())).toBe(
            '2 years',
        );
    });

    it('should return 0 years', () => {
        expect(agePipe.transform(undefined)).toBe('0 years');
    });
});
