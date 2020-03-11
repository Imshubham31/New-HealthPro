import { AppointmentResponseComponent } from '../../appointment-response/appointment-response.component';
import { AppointmentStatus } from '../../appointment-status.enum';
import { NgxdModule } from '@ngxd/core';
import { LocaliseService } from '../../../localise/localise.service';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { TestBed } from '@angular/core/testing';
import { Appointment } from '../../appointment.model';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { AppointmentStatusComponent } from '../../appointment-status/appointment-status.component';
import { DateRange } from '../../date-range';
import { Location } from '../../location';
import { IntegratedAvatarWithLabelComponent } from '@lib/shared/components/avatars/integrated-avatar-with-label.component';
import { IntegratedAppointmentDetailsComponent } from './integrated-appointment-details.component';
import { IntegratedAppointmentDetailsActionsComponent } from './integrated-appointment-details-actions.component';

xdescribe('IntegratedDetailsComponent', () => {
    let component: IntegratedAppointmentDetailsComponent;
    let appointment: Appointment;
    let defaultAppointment: Appointment;
    let localise: jasmine.SpyObj<LocaliseService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [NgxdModule],
            providers: [
                LocalisedDatePipe,
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localise', [
                        'fromKey',
                        'getLocale',
                    ]),
                },
            ],
            declarations: [
                IntegratedAppointmentDetailsComponent,
                MockLocalisePipe,
                AppointmentStatusComponent,
                AppointmentResponseComponent,
            ],
        });
    });

    beforeEach(() => {
        jasmine.clock().mockDate(new Date(2018, 10, 10, 12, 0, 30, 100));
        appointment = new Appointment(
            'title',
            'description',
            AppointmentStatus.scheduled,
            new DateRange(new Date(), new Date()),
            [],
            undefined,
            new Location('name', 'url'),
            undefined,
            new Date(),
            true,
        );
        defaultAppointment = new Appointment();
        component = TestBed.createComponent(
            IntegratedAppointmentDetailsComponent,
        ).componentInstance;
        localise = TestBed.get(LocaliseService);
        localise.fromKey.and.callFake(key => key);
        localise.getLocale.and.returnValue('en');
    });
    describe('title', () => {
        it('should display', () => {
            component.appointment = appointment;
            expect(component.title).toBe(appointment.title);
        });
        it('should display "Appointment" if omitted', () => {
            component.appointment = defaultAppointment;
            expect(component.title).toBe('appointment');
        });
    });
    describe('start date', () => {
        it('should display', () => {
            expect(component.startDate(appointment)).toBe('10 Nov 2018');
        });
        it('should not display if omitted', () => {
            expect(component.startDate(defaultAppointment)).toBe('');
        });
    });
    describe('day and time', () => {
        it('should display', () => {
            expect(component.dayAndTime(appointment)).toBe(
                'Saturday, 12:00 PM',
            );
        });
        it('should blank if start time omitted', () => {
            expect(component.dayAndTime(defaultAppointment)).toBe('');
        });
        it('should not display day without "," if start time is not set', () => {
            appointment.startDateIncludesTime = false;
            expect(component.dayAndTime(appointment)).toBe('Saturday');
        });
    });

    // TODO: Existing implementation on component is messy
    xdescribe('location', () => {
        it('should display', () => {
            fail('incomplete');
        });
        it('should not display if omitted', () => {
            fail('incomplete');
        });
    });
    describe('scheduled status', () => {
        it('should display', () => {
            component.appointment = appointment;
            expect(component.statusText).toBe('scheduled');
        });
    });
    describe('last modified', () => {
        it('should not display', () => {
            expect(component.lastModifiedDate(appointment)).toBe('');
        });
    });
    describe('description', () => {
        it('should display', () => {
            expect(component.description(appointment)).toBe(
                appointment.description,
            );
        });
        it('should display placeholder text if omitted', () => {
            expect(component.description(defaultAppointment)).toBe(
                'noFurtherInformation',
            );
        });
    });

    describe('actions', () => {
        it('should use actions for integrated appointments', () => {
            expect(component.actionsComponent.name).toBe(
                IntegratedAppointmentDetailsActionsComponent.name,
            );
        });
    });
    describe('watchers', () => {
        it('should use watchers for integrated appointments', () => {
            expect(component.watcherComponent.name).toBe(
                IntegratedAvatarWithLabelComponent.name,
            );
        });
    });
});
