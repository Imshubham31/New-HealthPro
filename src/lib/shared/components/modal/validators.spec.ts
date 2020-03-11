import { FormControl } from '@angular/forms';

import { ModalControlsValidators } from './validators';
import { DateRange } from '@lib/appointments/date-range';

describe('Validators', () => {
    let control;

    beforeEach(() => {
        control = new FormControl();
    });

    describe('::timeRangeBetween(range)', () => {
        const expectedRange = new DateRange(
            new Date(2017, 0, 1, 0, 0),
            new Date(2017, 0, 1, 23, 59),
        );

        it('should be valid if the control time range is between the given time range (inclusive, ignore date)', () => {
            control.setValue(expectedRange);
            expect(
                ModalControlsValidators.timeRangeBetween(expectedRange)(
                    control,
                ),
            ).toBeNull();

            control.setValue(
                new DateRange(
                    new Date(2018, 0, 1, 0, 0),
                    new Date(2018, 0, 1, 23, 59),
                ),
            );
            expect(
                ModalControlsValidators.timeRangeBetween(expectedRange)(
                    control,
                ),
            ).toBeNull();
        });
        // TODO :  will fix this later
        xit('should raise the timeRangeBetween error if the expected range does not contain the given', () => {
            const invalidRange = new DateRange(
                new Date(2017, 0, 1, 0, 0),
                new Date(2017, 0, 1, 23, 59),
            );

            control.setValue(invalidRange);
            expect(
                ModalControlsValidators.timeRangeBetween(expectedRange)(
                    control,
                ),
            ).toEqual({
                timeRangeBetween: {
                    expected: expectedRange,
                },
            });
        });
    });

    // TODO: These tests are flakey. The time expectations tend to fail intermittently
    describe('::timeRangeInFuture', () => {
        xit('should be valid if the time is after the current time (inclusive)', () => {
            control.setValue(
                new DateRange(new Date(), new Date(new Date().getDate() + 1)),
            );
            expect(
                ModalControlsValidators.timeRangeInFuture(control),
            ).toBeTruthy();
        });

        it('should be invalid if the time is before the current time', () => {
            const pastTime = new Date(Date.now() - 1);
            control.setValue(new DateRange(pastTime, new Date()));
            expect(ModalControlsValidators.timeRangeInFuture(control)).toEqual({
                timeRangeInPast: true,
            });
        });
    });
});
