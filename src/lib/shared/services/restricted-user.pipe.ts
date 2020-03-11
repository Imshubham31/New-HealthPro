import { Pipe, PipeTransform } from '@angular/core';
import { Restrictable } from '@lib/authentication/user.model';
import { LocaliseService } from '@lib/localise/localise.service';

@Pipe({ name: 'restricted' })
export class RestrictProcessingPipe implements PipeTransform {
    constructor(private localiseService: LocaliseService) {}
    transform(value?: Restrictable): any {
        if (!value) {
            return this.localiseService.fromKey('unknownUser');
        }
        if (value.isRestricted) {
            return this.localiseService.fromParams('assignedRole', [
                value.role,
            ]);
        }

        if (value.firstName || value.lastName) {
            return `${value.firstName.trim()} ${value.lastName.trim()}`;
        }

        if (value.name) {
            return `${value.name.trim()}`;
        }

        return value.displayName || this.localiseService.fromKey('unknownUser');
    }
}
