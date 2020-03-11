import { Component, Output } from '@angular/core';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { EventEmitter } from '@angular/core/';

@Component({
    selector: 'appointment-response',
    template: `
        <div class="response">
            <button class="responseBtn">
                {{ 'respond' | localise }} <i class="fa fa-caret-down"></i>
            </button>
            <div class="response-options">
                <div (click)="response.emit(status.accepted)">
                    <i class="fa fa-check-circle accept"></i>
                    {{ 'accept' | localise }}
                </div>
                <div (click)="response.emit(status.declined)">
                    <i class="fa fa-times-circle decline"></i>
                    {{ 'decline' | localise }}
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./appointment-response.component.scss'],
})
export class AppointmentResponseComponent {
    @Output() response = new EventEmitter<AppointmentStatus>();
    status = AppointmentStatus;
}
