import { Pipe, PipeTransform } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
@Pipe({
    name: 'age',
})
export class AgePipe implements PipeTransform {
    constructor(private localiseService: LocaliseService) {}

    transform(value: string): any {
        let age = 0;
        if (value) {
            const dob = new Date(value);
            const diff = Date.now() - dob.getTime();
            age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }
        const ageString = age < 10 ? 'patientAge' : 'patientAgeMoreTen';
        return this.localiseService.fromParams(ageString, [
            age.toLocaleString(this.localiseService.getLocale()),
        ]);
    }
}
