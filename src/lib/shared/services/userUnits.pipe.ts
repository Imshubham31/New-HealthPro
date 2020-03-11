import { Pipe, PipeTransform } from '@angular/core';

import { UnitsUtils } from '@lib/utils/units-utils';

@Pipe({
    name: 'userUnits',
})
export class UserUnitsPipe implements PipeTransform {
    constructor(private unitsUtils: UnitsUtils) {}

    transform(value: number, unitType: string): string {
        if (!value) {
            return null;
        }

        if (unitType === 'weight') {
            return this.unitsUtils.convertWeight(value);
        }

        if (unitType === 'height') {
            return this.unitsUtils.convertHeight(value);
        }
        return null;
    }
}
