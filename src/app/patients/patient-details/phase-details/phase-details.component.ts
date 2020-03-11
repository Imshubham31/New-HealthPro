import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PathwayUtils } from '@lib/pathway/pathway-utils';
import { Pathway } from '@lib/pathway/pathway.model';
import { Patient } from '../../patient.model';

@Component({
    selector: 'phase-details',
    templateUrl: './phase-details.component.html',
    styleUrls: ['./phase-details.component.scss'],
})
export class PhaseDetailsComponent {
    @Input() pathway: Pathway;
    @Input() patient: Patient;
    @Output() confirmMove = new EventEmitter();
    submitting: boolean;

    constructor() {
        this.submitting = false;
    }

    moveToNextPhase() {
        this.submitting = true;
        this.confirmMove.emit();
    }

    isLastSubphase() {
        return PathwayUtils.isFinalSubPhase(this.pathway);
    }
}
