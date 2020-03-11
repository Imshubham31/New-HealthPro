import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Appointment } from '@lib/appointments/appointment.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { Hcp } from '../../hcp.model';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { AppointmentFormFactory } from 'app/appointments/appointment-form/factories/appointment-form.factory';

// TO-DO Move this to a different file ...
export const enum Consent {
    Done,
    Pending,
    NotAgreed,
}

interface ConsentDescription {
    icon: string;
    description: string;
    date?: string;
}

@Component({
    selector: 'hcp-action-card',
    templateUrl: './hcp-actions-card.component.html',
    styleUrls: ['./hcp-actions-card.component.scss'],
})
export class HcpActionsCardComponent implements OnInit {
    @Input() hcpData: Hcp;
    @Output() openConversation = new EventEmitter();
    @Output() createAppointment = new EventEmitter<void>();
    @Output() editHcp = new EventEmitter<void>();
    appointment: Appointment;

    ngOnInit() {
        this.hospitalService.fetchHospital().subscribe();
    }
    get consentDescription(): ConsentDescription {
        return {
            icon: this.hcpData.optOut
                ? '../../../assets/disagreed.svg'
                : '../../../assets/pending.svg',
            description: this.hcpData.optOut
                ? this.localiseService.fromKey('notAgreed')
                : this.localiseService.fromKey('pending'),
            date: this.hcpData.optOutDatetime,
        };
    }

    get showConsentDescription() {
        return (
            this.hcpData.optOut ||
            !this.hcpData.onboardingState ||
            !this.hcpData.onboardingState.hasConsented
        );
    }

    constructor(
        private localiseService: LocaliseService,
        public hospitalService: HospitalService,
        public appointmentFactory: AppointmentFormFactory,
    ) {}
}
