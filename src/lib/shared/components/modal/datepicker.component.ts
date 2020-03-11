import { Component, Input } from '@angular/core';
import { Service } from './service';
import { LocaliseService } from '@lib/localise/localise.service';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { CandyDate } from 'ng-zorro-antd';
import { startOfMonth, startOfWeek } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

@Component({
    selector: 'app-modal-datepicker',
    template: `
        <nz-date-picker
            [(ngModel)]="value"
            (ngModelChange)="handleDateChanged($event)"
            [nzDisabled]="disabled"
            [nzFormat]="format"
            [nzDisabledDate]="disabledDates"
            [nzAllowClear]="canClear"
            nzPlaceHolder=""
        ></nz-date-picker>
    `,
})
export class ModalDatepickerComponent {
    @Input() min: Date;
    @Input() max: Date;
    @Input() canClear = true;

    disabled = false;
    format = 'dd/MM/yyyy';
    value: any;

    constructor(public service: Service, private i18n: NzI18nService) {
        this.service.getValue().subscribe(value => {
            this.value = value;
        });
        this.service.disabled$.subscribe(
            disabled => (this.disabled = disabled),
        );
        if (
            AuthenticationService.getUser() &&
            AuthenticationService.getUser().dateFormat
        ) {
            this.format = AuthenticationService.getUser().dateFormat;
        }
        this.i18n.setLocale(
            LocaliseService.toNgZorroLocale(
                AuthenticationService.getUserLanguage(),
            ),
        );
        CandyDate.prototype.calendarStart = function(): CandyDate {
            return new CandyDate(
                startOfWeek(startOfMonth(this.nativeDate), {
                    weekStartsOn: DateUtils.getWeekdayIndex(
                        AuthenticationService.getUser().firstDayOfWeek,
                    ),
                }),
            );
        };
    }

    disabledDates = (date: Date): boolean => {
        return (
            (this.min &&
                new Date(date.valueOf() + 24 * 60 * 60 * 1000) < this.min) ||
            (this.max &&
                new Date(date.valueOf() - 24 * 60 * 60 * 1000) > this.max)
        );
    }

    handleDateChanged(date) {
        this.value = date;
        this.service.onChange(date);
    }
}
