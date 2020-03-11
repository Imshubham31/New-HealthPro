import { HospitalService } from '@lib/hospitals/hospital.service';
import {
    AfterViewInit,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import * as $ from 'jquery';
import 'fullcalendar';
import { EventObject, Options } from 'fullcalendar';

import { Appointment } from '@lib/appointments/appointment.model';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { JNJTheme } from './calendar.fullcalendar-theme';
import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { addDays, addHours, isAfter, startOfWeek } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

export abstract class CalendarComponent implements AfterViewInit, OnChanges {
    @Input() appointments: Array<Appointment>;
    @Output() onAppointmentClick = new EventEmitter<Appointment>();
    private fullCalendar;
    weekStartDate;
    yeardate;
    weekDate = AuthenticationService.getUserStartOfWeek();
    chartOptions: Options = {
        firstDay: this.getStartDay(),
        locale: 'en',
        titleFormat: 'D MMM YYYY',
        allDaySlot: true,
        allDayText: this.localize.fromKey('allDay'),
        slotDuration: '01:00',
        slotLabelFormat: 'HH:mm',
        height: 650,
        scrollTime: DateUtils.formatDate(addHours(new Date(), -1), 'HH:mm:ss'),
        minTime: '00:00',
        eventDataTransform: event => {
            const className = AppointmentStatus[event.status]
                ? `fc-event--${AppointmentStatus[event.status].toLowerCase()}`
                : '';
            return {
                ...event,
                className,
            };
        },
        themeSystem: 'standard',
        nowIndicator: true,
    };
    constructor(
        private elementRef: ElementRef,
        protected localize: LocaliseService,
        private zone: NgZone,
        protected hospitalService: HospitalService,
    ) {
        const weekstart = startOfWeek(new Date(), {
            weekStartsOn: this.getStartDay(),
        });
        this.weekStartDate = DateUtils.formatDate(weekstart, 'dd MMM');
        this.yeardate = DateUtils.formatDate(new Date(weekstart), 'yyyy');
        this.chartOptions.locale = localize.getLocale();
        if (localize.getDirection() === 'rtl') {
            this.chartOptions.isRTL = true;
        }
        this.hospitalService
            .fetchHospital()
            .subscribe(
                hospital =>
                    (this.chartOptions.allDaySlot = Boolean(
                        hospital.integrated,
                    )),
            );

        (<any>$.fullCalendar).ThemeRegistry.register('standard', JNJTheme);
    }

    getStartDay() {
        return DateUtils.getWeekdayIndex(this.weekDate);
    }

    getEvents(start, end, timezone, callback) {
        callback(this.mapAppointmentsToEventObjects(this.appointments));
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.fullCalendar = $(this.elementRef.nativeElement).fullCalendar({
                ...this.chartOptions,
                buttonText: {
                    today: this.localize.fromKey('today'),
                },
                events: this.getEvents.bind(this),
                eventRender: (event, $element) => {
                    this.addStatusLabel(event, $element[0]);
                    this.markPastEvents(event, $element[0]);
                },
                viewRender: (view, $element) => {
                    this.headerDayEvent(view, $element, this.appointments);
                    this.formatHeaders($element[0]);
                    const displayWeekStartDate = DateUtils.formatDate(
                        view.start.toDate(),
                        'dd MMM',
                    );
                    const displayWeekEndDate = DateUtils.formatDate(
                        addDays(view.end.toDate(), -1),
                        'dd MMM yyyy',
                    );
                    $('.fc-left')
                        .find('h2')
                        .text(
                            displayWeekStartDate + ' - ' + displayWeekEndDate,
                        );
                    if (this.localize.getDirection() === 'rtl') {
                        $('.fc-right')
                            .find('h2')
                            .css('margin-top', '13px');
                    }
                },
                eventClick: (event: EventObject) => {
                    this.handleEventClick(event);
                },
            });
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.appointments &&
            this.fullCalendar &&
            !changes.appointments.firstChange
        ) {
            this.fullCalendar.fullCalendar('refetchEvents');
        }
    }

    private handleEventClick(event: EventObject) {
        this.zone.run(() => {
            this.onAppointmentClick.next(
                this.appointments.find(
                    appointment => appointment.id === event.id,
                ),
            );
        });
    }

    private mapAppointmentsToEventObjects(
        appointments: Array<Appointment>,
    ): Array<EventObject> {
        return appointments.map(appointment =>
            this.mapAppointment(appointment),
        );
    }

    private mapAppointment(appointment: Appointment) {
        return {
            id: appointment.id,
            title: appointment.title || this.localize.fromKey('appointment'),
            start: appointment.timeSlot.start,
            end: Boolean(appointment.startDateIncludesTime)
                ? appointment.timeSlot.end
                : null,
            status: appointment.status,
            allDay: !Boolean(appointment.startDateIncludesTime),
        };
    }

    private markPastEvents(event, element) {
        if (event.end && isAfter(new Date(), event.end.toDate())) {
            element.classList.add('fc-event--past');
        }
    }

    abstract headerDayEvent(view, element, appointment);
    abstract addStatusLabel(event, element: HTMLElement);
    abstract formatHeaders(element: HTMLElement);
}
