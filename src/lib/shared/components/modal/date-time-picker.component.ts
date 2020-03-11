import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Service } from './service';

@Component({
    selector: 'app-modal-date-time-picker',
    template: `
        <ng-container [formGroup]="group">
            <app-modal-form-control
                formControlName="date"
                label="{{ dateLabel | localise }}"
            >
                <app-modal-datepicker
                    [min]="min"
                    [max]="max"
                    [canClear]="canClear"
                ></app-modal-datepicker>
            </app-modal-form-control>
            <app-modal-form-control
                formControlName="time"
                class="margin-start-1"
                label="{{ timeLabel | localise }}"
            >
                <app-modal-timepicker></app-modal-timepicker>
            </app-modal-form-control>
        </ng-container>
    `,
    styles: [
        ':host { display: flex }',
        'app-modal-form-control { width: 50% }',
    ],
})
export class ModalDateTimePickerComponent implements OnChanges {
    @Input() canClear = false;
    @Input() disabled = false;
    @Input() min: Date;
    @Input() max: Date;
    @Input() dateLabel = 'date';
    @Input() timeLabel = 'time';

    group = new FormGroup({
        date: new FormControl(),
        time: new FormControl(),
    });

    constructor(public service: Service) {
        this.service.getValue().subscribe((value: Date) => {
            this.group.setValue(
                {
                    date: value ? new Date(value.getTime()) : null,
                    time: value ? new Date(value.getTime()) : null,
                },
                { emitEvent: false },
            );
            this.disableTimeIfDateNotSet(this.group.value.date);
        });
        this.handleDateValueChanges();
        this.handleGroupChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.disabled) {
            this.disableTimeIfDateNotSet(this.group.value.date);
        }
    }

    private handleDateValueChanges() {
        this.group.get('date').valueChanges.subscribe(value => {
            this.disableTimeIfDateNotSet(value);
        });
    }

    private disableTimeIfDateNotSet(value) {
        const timeControl = this.group.get('time');
        if (value && !this.disabled) {
            timeControl.enable({ onlySelf: true });
        } else if (!value) {
            timeControl.setValue(null, { onlySelf: true });
            timeControl.disable({ onlySelf: true });
        } else {
            timeControl.disable({ onlySelf: true });
        }
    }

    private handleGroupChanges() {
        this.group.valueChanges.subscribe(value => {
            this.service.setValidationErrors(
                value.date && !value.time ? { dateTimePicker: true } : null,
            );
            this.service.onChange(
                value.date && value.time
                    ? this.bindTimeToDate(value.time, value.date)
                    : null,
            );
        });
    }

    private bindTimeToDate(time: Date, date: Date) {
        // avoid mutating the params
        const dateTime = new Date(date.getTime());
        dateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return dateTime;
    }
}
