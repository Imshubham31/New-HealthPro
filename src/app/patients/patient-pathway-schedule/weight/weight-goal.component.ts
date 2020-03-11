import { Component } from '@angular/core';
import { Masks } from '@lib/utils/masks';
import { UnitsUtils } from '@lib/utils/units-utils';
import { FormControl, FormGroupName, Validators } from '@angular/forms';

@Component({
    selector: 'app-weight',
    templateUrl: './weight-goal.component.html',
    styleUrls: ['../patient-pathway-schedule.component.scss'],
})
export class WeightComponent {
    control: FormControl;

    constructor(public unitUtils: UnitsUtils, private group: FormGroupName) {
        this.control = this.group.control.controls.target as FormControl;
        this.control.setValue(this.unitUtils.convertWeight(this.control.value));
        this.control.setValidators([
            Validators.min(0.1),
            Validators.max(999.99),
            Validators.required,
        ]);
    }

    applyMask(weightField) {
        Masks.metric(weightField);
    }
}
