import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '@lib/utils/date-utils';
@Pipe({
    name: 'dateformat',
})
export class DatefunctionsPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        const newDate = new Date(value);
        return DateUtils.formatDateUserPreference(newDate);
    }
}
