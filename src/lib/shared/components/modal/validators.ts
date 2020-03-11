import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateRange } from '@lib/appointments/date-range';
import { setDate, setMonth, setYear } from 'date-fns';

export class ModalControlsValidators {
    static timeRangeBetween(range: DateRange): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            const value: DateRange = control.value;
            if (!value) {
                return null;
            }

            const timeStart = setYear(
                setMonth(
                    setDate(range.start, value.start.getDate()),
                    value.start.getMonth(),
                ),
                value.start.getFullYear(),
            );

            const timeEnd = setYear(
                setMonth(
                    setDate(range.end, value.end.getDate()),
                    value.end.getMonth(),
                ),
                value.end.getFullYear(),
            );

            const containsActual =
                timeStart.getTime() <= value.start.getTime() &&
                timeEnd.getTime() >= value.end.getTime();
            return containsActual
                ? null
                : { timeRangeBetween: { expected: range } };
        };
    }

    static timeRangeInFuture(control: AbstractControl): ValidationErrors {
        const value: DateRange = control.value;
        if (!value) {
            return null;
        }

        const isValueInFuture = value.start.getTime() >= Date.now();
        return isValueInFuture ? null : { timeRangeInPast: true };
    }
}
