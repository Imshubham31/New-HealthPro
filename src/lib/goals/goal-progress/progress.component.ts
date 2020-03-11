import { Pathway } from '@lib/pathway/pathway.model';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Patient } from '../../../app/patients/patient.model';

@Component({
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnChanges {
    @Input() patient: Patient;
    @Input() pathway: Pathway;
    @Input() subtext = '';
    max = 100;
    currentValue = 0;
    centerText = '0';
    failed = false;

    ngOnInit() {
        this.fetchValue();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pathway) {
            this.fetchValue();
        }
    }

    fetchValue() {}
}
