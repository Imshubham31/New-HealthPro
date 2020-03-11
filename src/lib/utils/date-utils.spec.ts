import { DateUtils } from '@lib/utils/date-utils';

describe('DateUtils', () => {
    describe('should handle clear time', () => {
        const date = new Date(2020, 1, 1, 12, 34, 56, 123);
        const cleared = DateUtils.clearTime(date);

        it('should have cleared all time', () => {
            expect(cleared.getHours()).toBe(0);
            expect(cleared.getMinutes()).toBe(0);
            expect(cleared.getSeconds()).toBe(0);
            expect(cleared.getMilliseconds()).toBe(0);
        });
    });

    describe('handle start of week', () => {
        it('should return current language direction', () => {
            expect(DateUtils.getWeekdayIndex('sunday')).toBe(0);
            expect(DateUtils.getWeekdayIndex('monday')).toBe(1);
            expect(DateUtils.getWeekdayIndex('tuesday')).toBe(2);
            expect(DateUtils.getWeekdayIndex('wednesday')).toBe(3);
            expect(DateUtils.getWeekdayIndex('thursday')).toBe(4);
            expect(DateUtils.getWeekdayIndex('friday')).toBe(5);
            expect(DateUtils.getWeekdayIndex('saturday')).toBe(6);
        });
    });
});
