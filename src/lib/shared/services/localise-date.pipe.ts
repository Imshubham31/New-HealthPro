import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';

@Pipe({
    name: 'localisedDate',
})
export class LocalisedDatePipe implements PipeTransform {
    constructor(private localiseService: LocaliseService) {}

    transform(value: any, pattern: string = 'mediumDate'): any {
        if (!value) {
            return;
        }
        const datePipe: DatePipe = new DatePipe(
            this.localiseService.getLocale(),
        );
        try {
            return datePipe
                .transform(value, pattern)
                .replace(/[0-9]/g, digit => {
                    return Number(digit).toLocaleString(
                        this.localiseService.getLocale(),
                    );
                });
        } catch {
            return value;
        }
    }
}
