import { Pipe, PipeTransform } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';

@Pipe({
    name: 'localise',
})
export class Localise implements PipeTransform {
    constructor(private localise: LocaliseService) {}

    transform(value: string | number, args?: any[]): any {
        if (!value) {
            return;
        }

        if (isNaN(value as any)) {
            if (args && args.length > 0) {
                return this.localise.fromParams(value as string, args);
            }
            return this.localise.fromKey(value as string);
        }

        return Number(value).toLocaleString(this.localise.getLocale());
    }
}
