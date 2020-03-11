import { Component, Input } from '@angular/core';

@Component({
    selector: 'next-appt-info',
    template: `
        <div>
            <img src="./../../../assets/calendar_b.svg" />
        </div>
        <div class="icon-padding">
            <div class="title">{{ 'nextAppointment' | localise }}</div>
            <div>
                <a
                    id="apptInfoDateTime"
                    *ngIf="startDateTime; else noAppointment"
                    [routerLink]="routeLink"
                    [queryParams]="queryParams"
                >
                    {{ startDateTime * 1000 | dateformat }}
                </a>
                <ng-template #noAppointment>
                    <span>{{ 'noPlannedAppointments' | localise }}</span>
                </ng-template>
            </div>
        </div>
    `,
    styleUrls: ['./next-appt-info.component.scss'],
})
export class NextApptInfoComponent {
    @Input() startDateTime: number;
    @Input() routeLink: string;
    @Input() queryParams: Object;
}
