import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PatientOverview } from 'app/patients/view-patient.model';

@Component({
    selector: 'master-detail-header',
    template: `
        <div>
            <img
                *ngIf="patient"
                class="flip-on-rtl"
                src="../../../../../assets/back_button.svg"
            />
            <a
                *ngIf="patient"
                [routerLink]="[
                    '/patient/details',
                    { id: patient.patient.backendId }
                ]"
                class="link padding-left-1"
                >{{ 'backToDetails' | localise: [patient.patient.fullName] }}</a
            >
        </div>
        <div class="header-title">{{ title }}</div>
        <button
            class="btn btn-primary btn-block btn-lg create-button"
            id="start-message"
            (click)="onCreate.emit()"
        >
            {{ buttonTitle }}
        </button>
        <ng-content select="[master-search]"></ng-content>
    `,
    styleUrls: ['./master-detail-header.component.scss'],
})
export class MasterDetailHeaderComponent {
    @Output() onCreate = new EventEmitter();
    @Input() patient: PatientOverview;
    @Input() title: string;
    @Input() buttonTitle: string;
}
