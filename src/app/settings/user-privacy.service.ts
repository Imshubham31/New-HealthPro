import { Injectable } from '@angular/core';
import { UserRestService } from '@lib/authentication/user-rest.service';

@Injectable()
export class UserPrivacyService {
    constructor(private userRestService: UserRestService) {}

    exportData$() {
        return this.userRestService.create({}, { subPath: '/gdpr/export' });
    }

    beForgotten$() {
        return this.userRestService.create({}, { subPath: '/gdpr/forget' });
    }

    initiateRightToRestrictProcessing$(reason: string, explanation: string) {
        return this.userRestService.create(
            { reason, explanation },
            { subPath: '/gdpr/restriction/request' },
        );
    }
}
