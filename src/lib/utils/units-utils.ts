import * as round from 'lodash/round';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UnitsUtils {
    constructor(private localise: LocaliseService) {}

    get weightUnit() {
        return AuthenticationService.getUser().units === 'metric'
            ? this.localise.fromKey('kg')
            : this.localise.fromKey('lb');
    }

    get heightUnit() {
        return AuthenticationService.getUser().units === 'metric'
            ? this.localise.fromKey('cm')
            : '';
    }

    static formatWeight(value: number) {
        const user = AuthenticationService.getUser();
        if (user.units !== 'imperial') {
            return Number(value);
        }

        return Number(value) / 2.2046226218;
    }

    static formatHeight(value: string) {
        const user = AuthenticationService.getUser();
        if (user.units !== 'imperial') {
            return round(value, 2);
        }

        value = UnitsUtils.parseNumberString(value);
        // prettier-ignore
        const values = value.split('\'');
        const cms =
            (parseInt(values[0], 10) * 12 + parseInt(values[1], 10)) * 2.54;
        return cms;
    }

    static parseNumberString(numString): string {
        return numString.replace('٫', '.').replace(/[٠١٢٣٤٥٦٧٨٩]/g, digit => {
            return Number(digit.charCodeAt(0) - 1632);
        });
    }

    convertWeight(value: number) {
        if (AuthenticationService.getUser().units !== 'imperial') {
            return round(value, 2).toLocaleString(this.localise.getLocale());
        }

        return round(value * 2.2046226218, 2).toLocaleString(
            this.localise.getLocale(),
        );
    }

    convertHeight(value: number) {
        if (AuthenticationService.getUser().units !== 'imperial') {
            return round(value, 2).toLocaleString(this.localise.getLocale());
        }

        value = value / 2.54;
        const feet = Math.floor(value / 12).toLocaleString(
            this.localise.getLocale(),
        );
        const inches = Math.floor(value % 12).toLocaleString(
            this.localise.getLocale(),
        );
        return `${feet}'${inches}"`;
    }
}
