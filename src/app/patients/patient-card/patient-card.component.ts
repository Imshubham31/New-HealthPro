import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { PathwayUtils } from '@lib/pathway/pathway-utils';
import { Pathway } from '@lib/pathway/pathway.model';
import { PathWayService } from '@lib/pathway/pathway.service';
import { PatientOverview } from '../view-patient.model';

@Component({
    selector: 'patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.scss'],
})
@Unsubscribe()
export class PatientCardComponent implements OnInit {
    @Input() patient: PatientOverview;
    @Input() pathway: Pathway;
    @Input() showDetailsButton = true;
    @Input() showEditDetails = false;
    @Input() startNewConversation: boolean;
    pathwayUtils = PathwayUtils;
    subscriptions: Subscription[] = [];

    constructor(private pathWayService: PathWayService) {}
    ngOnInit(): void {
        if (!this.pathway) {
            this.subscriptions.push(
                this.pathWayService
                    .getPathwayById$(this.patient.patient.pathwayId)
                    .subscribe(next => (this.pathway = next)),
            );
        }
    }
}
