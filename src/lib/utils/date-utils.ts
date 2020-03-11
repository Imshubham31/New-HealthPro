import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { format } from 'date-fns';

export class DateUtils {
    static getDateOptions(): {
        locale: Locale;
        weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    } {
        const locale = LocaliseService.toDateFnsLocale(
            AuthenticationService.getUserLanguage(),
        );

        const weekStartDay = DateUtils.getWeekdayIndex(
            AuthenticationService.getUserStartOfWeek(),
        );

        return {
            locale: locale,
            weekStartsOn: weekStartDay,
        };
    }

    static formatDate(date: Date, dateFormat: string): string {
        return format(date, dateFormat, this.getDateOptions());
    }

    static formatDateUserPreference(date: Date): string {
        return format(
            date,
            AuthenticationService.getUserDateFormat(),
            this.getDateOptions(),
        );
    }

    static clearTime(date: Date): Date {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    static setEndOfDay(date: Date): Date {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        return date;
    }

    public static getWeekdayIndex(weekday: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
        if (weekday === 'sunday') {
            return 0;
        } else if (weekday === 'monday') {
            return 1;
        } else if (weekday === 'tuesday') {
            return 2;
        } else if (weekday === 'wednesday') {
            return 3;
        } else if (weekday === 'thursday') {
            return 4;
        } else if (weekday === 'friday') {
            return 5;
        } else if (weekday === 'saturday') {
            return 6;
        }

        return 0;
    }
}
