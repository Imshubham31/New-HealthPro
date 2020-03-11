import { TestBed } from '@angular/core/testing';

import { Languages } from './languages';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';

describe('LocaliseService', () => {
    const lang = {
        strings: {
            test: 'test string',
            params: (params: string[]) => `${params[0]} test`,
        },
        dir: 'ltr',
    };
    let localise: LocaliseService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [
                LocaliseService,
                {
                    provide: Languages,
                    useValue: { mockLang: lang },
                },
            ],
        });
    });
    describe('from key', () => {
        beforeEach(() => {
            localise = TestBed.get(LocaliseService);
            localise.use('mockLang');
        });

        it('should localise', () =>
            expect(localise.fromKey('test')).toBe(lang.strings.test));

        it('should not localise and return key', () =>
            expect(localise.fromKey('badKey')).toBe('badKey'));
    });

    describe('from params', () => {
        beforeEach(() => {
            localise = TestBed.get(LocaliseService);
            localise.use('mockLang');
        });

        it('should localise', () =>
            expect(localise.fromParams('params', ['param'])).toBe(
                lang.strings.params(['param']),
            ));

        it('should not localise and return key', () =>
            expect(localise.fromParams('badKey', ['param'])).toBe('badKey'));

        xit('should not localise if key is not function', () =>
            expect(localise.fromParams('test', ['param'])).toBe('test'));
    });

    describe('handle no lang', () => {
        beforeEach(() => {
            localise = TestBed.get(LocaliseService);
            localise.use(undefined);
        });

        describe('from key', () =>
            it('should not localise', () =>
                expect(localise.fromKey('test')).toBe('test')));

        describe('from params', () =>
            it('should not localise', () =>
                expect(localise.fromParams('test', [])).toBe('test')));
    });
});
