import { Patient } from './../patient.model';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'patient-contact-info',
    templateUrl: './patient-contact-info.component.html',
    styleUrls: ['./patient-contact-info.component.scss'],
})
export class PatientContactInfoComponent {
    @Input() patient: Patient;
}
