import { Subscription } from 'rxjs';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatientOverview } from './../view-patient.model';
import { Localise } from '@lib/localise/localise.pipe';

@Component({
    selector: 'patient-mdt-team',
    templateUrl: './patient-mdt-team.component.html',
    styleUrls: ['./patient-mdt-team.component.scss'],
})
@Unsubscribe()
export class PatientMdtTeamComponent {
    @Input() patientOverview: PatientOverview;
    @Output() openAssignMDT = new EventEmitter<PatientOverview>();
    subscriptions: Subscription[] = [];

    get remaningTeamMembers() {
        const mdts = this.patientOverview.patient.mdts.filter(
            v => v.personal === true,
        );
        if (!mdts[0].hcps || mdts[0].hcps.length <= 2) {
            return '';
        }
        return `${this.localise.transform(
            Math.max(mdts[0].hcps.length - 2, 0),
        )}`;
    }

    constructor(private localise: Localise) {}
}
