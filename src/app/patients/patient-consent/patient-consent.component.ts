import { Patient } from '../patient.model';
import { Component, Input, OnInit } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { oc } from 'ts-optchain';

// TO-DO Move this to a different file ...
export enum Consent {
    Done,
    Pending,
    NotAgreed,
}

interface ConsentDescription {
    icon: string;
    description: string;
    status: Consent;
    date?: string;
}

@Component({
    selector: 'patient-consent',
    templateUrl: './patient-consent.component.html',
    styleUrls: ['./patient-consent.component.scss'],
})
export class PatientConsentComponent implements OnInit {
    @Input() patient: Patient;
    consentDescription: ConsentDescription;
    consent = Consent;

    constructor(private localiseService: LocaliseService) {}

    ngOnInit() {
        this.consentDescription = this.getConsentDescription();
    }

    getConsentDescription(): ConsentDescription {
        if (oc(this.patient).onboardingState.hasConsented() === true) {
            return {
                icon: '../../assets/consent_done.svg',
                description: this.localiseService.fromKey('agreed'),
                date: this.patient.onboardingState.consentDate,
                status: Consent.Done,
            };
        }

        if (this.patient.optOut === true) {
            return {
                icon: '../../assets/disagreed.svg',
                description: this.localiseService.fromKey('notAgreed'),
                date: this.patient.optOutDatetime,
                status: Consent.NotAgreed,
            };
        }

        return {
            icon: '../../assets/pending.svg',
            description: this.localiseService.fromKey('pending'),
            status: Consent.Pending,
        };
    }
}
