import { MockAppointmentFormFactory } from './factories/mock-appointment-form.factory';
import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash/fp';
import { AppointmentFormHintsGenerator } from './appointment-form-hints-generator';
import { LocaliseService } from '@lib/localise/localise.service';
import { DateRange } from '@lib/appointments/date-range';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AppointmentFormModelFactory } from './factories/appointment-form-model.factory';

describe('AppointmentFormHintsGenerator', () => {
    let hintsGenerator: AppointmentFormHintsGenerator;
    let form: FormGroup;
    let localise: LocaliseService;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [
                AppointmentFormHintsGenerator,
                LocaliseService,
                MockAppointmentFormFactory.buildProvider(),
            ],
        });
    });

    beforeEach(() => {
        form = AppointmentFormModelFactory.createFormGroupFromAppointment();
        hintsGenerator = TestBed.get(AppointmentFormHintsGenerator);
        localise = TestBed.get(LocaliseService);
    });

    describe('timeSpan hints', () => {
        const errors = {
            timeRangeInvalid: true,
            timeRangeInPast: true,
            timeRangeBetween: {
                expected: new DateRange(
                    new Date(2017, 0, 1, 7, 0, 0),
                    new Date(2017, 0, 1, 23, 59, 59),
                ),
            },
        };

        it('should be an empty array if there are no errors', () => {
            form.get('timeSpan').setErrors(null);

            const hints = hintsGenerator.getHints(form);

            expect(hints.timeSpan).toEqual([]);
        });

        it('should return timeRangeInvalid error if present', () => {
            form.get('timeSpan').setErrors(errors);

            const hints = hintsGenerator.getHints(form);

            expect(hints.timeSpan).toEqual([
                localise.fromKey('formTimeRangeStartGreaterThanEnd'),
            ]);
        });

        it('should return timeRangeInPast error if present', () => {
            form.get('timeSpan').setErrors(
                _.dissoc('timeRangeInvalid', errors),
            );

            const hints = hintsGenerator.getHints(form);

            expect(hints.timeSpan).toEqual([
                localise.fromKey('formTimeRangeInPast'),
            ]);
        });

        it('should return timeRangeBetween error if present', () => {
            form.get('timeSpan').setErrors(_.pick('timeRangeBetween', errors));

            const hints = hintsGenerator.getHints(form);

            expect(hints.timeSpan).toEqual([
                localise.fromParams('appointmentTimeRangeBetween', [
                    '07:00 AM',
                    '11:59 PM',
                ]),
            ]);
        });

        it('should ignore other errors', () => {
            form.get('timeSpan').setErrors({ required: true });

            const hints = hintsGenerator.getHints(form);

            expect(hints.timeSpan).toEqual([]);
        });
    });
});
