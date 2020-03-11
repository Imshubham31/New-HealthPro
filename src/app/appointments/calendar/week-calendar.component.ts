import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    ViewEncapsulation,
    ChangeDetectorRef,
} from '@angular/core';
import 'fullcalendar';
import * as $ from 'jquery';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { LocaliseService } from '@lib/localise/localise.service';
import { CalendarComponent } from '@lib/appointments/calendar/calendar.component';
import { HospitalService } from '@lib/hospitals/hospital.service';

@Component({
    selector: 'weekly-calendar',
    templateUrl: './week-calendar.component.html',
    styleUrls: ['./week-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None, // needed for the calendar styles
    changeDetection: ChangeDetectionStrategy.Default,
})
export class WeeklyCalendarComponent extends CalendarComponent {
    modelPop = false;
    appointmentOnDate;
    getDate;
    constructor(
        elementRef: ElementRef,
        protected localize: LocaliseService,
        zone: NgZone,
        protected hospitalService: HospitalService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super(elementRef, localize, zone, hospitalService);
        if (localize.getDirection() === 'rtl') {
            this.chartOptions.header = {
                left: 'today',
                center: '',
                right: 'prev title next',
            };
        } else {
            this.chartOptions.header = {
                left: 'prev title next',
                center: '',
                right: 'today',
            };
        }
        this.chartOptions.defaultView = 'agendaWeek';
    }

    headerDayEvent(event, element, appointment) {
        const _this = this;
        const header = document.querySelectorAll('.fc-day-header');
        header.forEach(head => {
            head.addEventListener('click', function(e) {
                $('.modal.appointMentmodal').addClass('active');
                _this.appointmentOnDate = [];
                console.log(_this.appointmentOnDate);
                e.preventDefault();
                _this.getDate = $(this).data('date');
                appointment.forEach(appo => {
                    if (
                        new Date(appo.date).setHours(0, 0, 0, 0) ===
                        new Date(_this.getDate).setHours(0, 0, 0, 0)
                    ) {
                        _this.appointmentOnDate.push(appo);
                        _this.appointmentOnDate.sort((a, b) =>
                            a.timeSlot.start > b.timeSlot.start ? 1 : -1,
                        );
                    }
                });
                _this.modelPop = true;
                _this.changeDetectorRef.markForCheck();
            });
        });
    }

    closemodal() {
        $('.modal.appointMentmodal').removeClass('active');
    }

    addStatusLabel(event, element: HTMLElement) {
        if (
            event.status === AppointmentStatus.accepted ||
            event.status === AppointmentStatus.scheduled ||
            event.status === AppointmentStatus.updated ||
            event.status === AppointmentStatus.attended ||
            event.status === AppointmentStatus.missed
        ) {
            return;
        }

        const labelIcon =
            event.status === AppointmentStatus.declined
                ? 'fa-times-circle'
                : 'fa-clock-o';
        const label = document.createElement('div');
        label.classList.add('fc-status-label');
        label.innerHTML = `
            ${this.localize.fromKey(AppointmentStatus[event.status])}
            <i class="fa ${labelIcon}">
        `;

        element.querySelector('.fc-content').appendChild(label);
    }

    formatHeaders(element: HTMLElement) {
        Array.from(element.querySelectorAll('.fc-day-header')).forEach(
            header => {
                if (this.localize.calendarWeeklyHeader) {
                    header.innerHTML = this.localize.calendarWeeklyHeader(
                        new Date(header.getAttribute('data-date')),
                    );
                }
            },
        );
    }
}
