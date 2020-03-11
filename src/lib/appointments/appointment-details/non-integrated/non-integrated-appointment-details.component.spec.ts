import { AvatarWithLabelComponent } from '@lib/shared/components/avatars/avatar-with-label.component';
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
import { AppointmentResponseComponent } from '../../appointment-response/appointment-response.component';
import { NonIntegratedAppointmentDetailsComponent } from './non-integrated-appointment-details.component';
import { NonIntegratedAppointmentDetailsActionsComponent } from './non-integrated-appointment-details-actions.component';
import { MockAppointmentFormFactory } from 'app/appointments/appointment-form/factories/mock-appointment-form.factory';

xdescribe('NonIntegratedDetailsComponent', () => {
    let component: NonIntegratedAppointmentDetailsComponent;
    let appointment: Appointment;
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
                MockAppointmentFormFactory.buildProvider(),
            ],
            declarations: [
                NonIntegratedAppointmentDetailsComponent,
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
        component = TestBed.createComponent(
            NonIntegratedAppointmentDetailsComponent,
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
    });
    describe('start date', () => {
        it('should display', () => {
            expect(component.startDate(appointment)).toBe('10 Nov 2018');
        });
    });
    describe('day and time', () => {
        it('should display', () => {
            expect(component.dayAndTime(appointment)).toBe(
                'Saturday, 12:00 PM',
            );
        });
    });

    describe('scheduled status', () => {
        it('should display', () => {
            component.appointment = appointment;
            expect(component.statusText).toBe(
                AppointmentStatus[appointment.status],
            );
        });
    });
    describe('last modified', () => {
        it('should display', () => {
            expect(component.lastModifiedDate(appointment)).toBe('10 Nov 2018');
        });
    });
    describe('description', () => {
        it('should display', () => {
            expect(component.description(appointment)).toBe(
                appointment.description,
            );
        });
    });

    describe('actions', () => {
        it('should use actions for integrated appointments', () => {
            expect(component.actionsComponent.name).toBe(
                NonIntegratedAppointmentDetailsActionsComponent.name,
            );
        });
    });
    describe('watchers', () => {
        it('should use watchers for integrated appointments', () => {
            expect(component.watcherComponent.name).toBe(
                AvatarWithLabelComponent.name,
            );
        });
    });
});
