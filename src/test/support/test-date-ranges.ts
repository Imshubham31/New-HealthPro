import { DateRange } from '@lib/appointments/date-range';
import { addDays, addHours } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

export class TestDateRanges {
    /**
     * @param {Date} date Relative to date
     */
    static createThisTimeTomorrow(date: Date = new Date()) {
        date = DateUtils.clearTime(date);

        return new DateRange(addDays(date, 1), addDays(addHours(date, 2), 1));
    }

    /**
     * @param {Date} date Relative to date
     */
    static createThisTimeYesterday(date: Date = new Date()) {
        date = DateUtils.clearTime(date);

        return new DateRange(addDays(date, -1), addDays(addHours(date, 2), -1));
    }
}
