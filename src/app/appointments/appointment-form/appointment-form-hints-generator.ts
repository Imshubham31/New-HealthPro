import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { DateUtils } from '@lib/utils/date-utils';

@Injectable()
export class AppointmentFormHintsGenerator {
    constructor(private localize: LocaliseService) {}

    getHints(form: FormGroup) {
        return {
            timeSpan: this.getTimeSpanHints(form),
        };
    }

    private getTimeSpanHints(form: FormGroup): string[] {
        const errors = form.get('timeSpan').errors || {};

        if (errors.timeRangeInvalid) {
            return [this.localize.fromKey('formTimeRangeStartGreaterThanEnd')];
        }

        if (errors.timeRangeInPast) {
            return [this.localize.fromKey('formTimeRangeInPast')];
        }

        if (errors.timeRangeBetween) {
            const { start, end } = errors.timeRangeBetween.expected;
            return [
                this.localize.fromParams('appointmentTimeRangeBetween', [
                    DateUtils.formatDate(start, 'hh:mm a'),
                    DateUtils.formatDate(end, 'hh:mm a'),
                ]),
            ];
        }

        return [];
    }
}
