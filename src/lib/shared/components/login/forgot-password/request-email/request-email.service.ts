import { Injectable } from '@angular/core';
import { UserRestService } from '@lib/authentication/user-rest.service';

@Injectable()
export class RequestEmailService {
    constructor(private userRestService: UserRestService) {}

    sendPasswordEmail(email: string) {
        return this.userRestService.create(
            { email },
            { subPath: '/reset-password' },
        );
    }
}
