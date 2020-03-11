import { Component } from '@angular/core';
import { FormControl, Validators, FormGroupName } from '@angular/forms';
import { Masks } from '@lib/utils/masks';

@Component({
    selector: 'app-step-goal',
    templateUrl: './step-goal.component.html',
    styleUrls: ['../patient-pathway-schedule.component.scss'],
})
export class StepsComponent {
    control: FormControl;

    constructor(private group: FormGroupName) {
        this.control = this.group.control.controls.target as FormControl;
        this.control.setValidators([
            Validators.min(0),
            Validators.max(99999),
            Validators.required,
        ]);
    }

    applyMask(steps) {
        Masks.steps(steps);
    }
}
