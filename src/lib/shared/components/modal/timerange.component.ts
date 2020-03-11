import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { Service } from './service';
import { DateRange } from '@lib/appointments/date-range';

@Component({
    selector: 'app-modal-time-range',
    template: `
        <ng-container [formGroup]="formGroup">
            <app-modal-form-control
                class="timepicker"
                formControlName="start"
                [required]="true"
                [makeBolder]="true"
                label="{{ 'from' | localise }}"
            >
                <app-modal-timepicker></app-modal-timepicker>
            </app-modal-form-control>
            <app-modal-form-control
                formControlName="end"
                class="timepicker margin-start-1"
                [required]="true"
                [makeBolder]="true"
                label="{{ 'to' | localise }}"
            >
                <app-modal-timepicker></app-modal-timepicker>
            </app-modal-form-control>
        </ng-container>
    `,
    styles: [':host { display: flex }', '.timepicker { flex: 1 }'],
})
export class ModalTimeRangeComponent implements OnChanges {
    // For which date are we choosing time
    @Input() date: Date;

    formGroup = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    constructor(public service: Service) {
        service.getValue().subscribe((value: DateRange) => {
            this.formGroup.setValue(value || new DateRange(null, null), {
                emitEvent: false,
            });
        });

        service.disabled$.subscribe(disabled => {
            this.formGroup[disabled ? 'disable' : 'enable']();
        });

        this.formGroup.valueChanges.subscribe(() => this.notifyService());
    }

    ngOnChanges() {
        // Expression has changed after it was checked otherwise
        setTimeout(() => {
            this.notifyService();
        }, 0);
    }

    private notifyService() {
        const { start, end } = this.formGroup.value as DateRange;
        if (!start || !end) {
            this.service.onChange(null);
            return;
        }

        // FIXME: date comes in as null from schedule app form, won't trigger
        // default params.
        const range = new DateRange(
            this.bindTimeToDate(start, this.date || new Date()),
            this.bindTimeToDate(end, this.date || new Date()),
        );
        this.service.setValidationErrors(this.validate(range));
        this.service.onChange(range);
    }

    private bindTimeToDate(time: Date, date: Date) {
        // avoid mutating the params
        const dateTime = new Date(date.getTime());
        dateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return dateTime;
    }

    private validate(range: DateRange): ValidationErrors {
        const isRangeValid = range.start.getTime() < range.end.getTime();
        return isRangeValid ? null : { timeRangeInvalid: true };
    }
}
