import { TruncatePipe } from './truncate.pipe';

describe('Truncate pipe', () => {
    const truncate = new TruncatePipe();
    const testString = '0123456789abcdef';

    it('should truncate string to max length given + elipsis', () =>
        expect(truncate.transform(testString, 1)).toBe('0...'));

    it('should truncate to default length 10 if no max length is given + elipsis', () =>
        expect(truncate.transform(testString)).toBe(
            testString.substring(0, 10) + '...',
        ));

    it('should not truncate if string is shorter than max length', () =>
        expect(truncate.transform(testString, 17)).toBe(testString));
});
