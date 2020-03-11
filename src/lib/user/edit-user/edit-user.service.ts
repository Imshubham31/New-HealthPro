import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { EditUserRestService } from './edit-user-rest.service';
import { LocaliseService } from '@lib/localise/localise.service';

export interface UserEdit {
    backendId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    gender: string;
    units: string;
    language: string;
    firstDayOfWeek: string;
    dateFormat: string;
}
@Injectable()
export class EditUserService {
    userData = new Subject<User>();

    constructor(
        private editUserService: EditUserRestService,
        private localiseService: LocaliseService,
    ) {}

    editUserData(user: UserEdit) {
        return this.editUserService.patch(Number(user.backendId), user).pipe(
            tap(success => {
                const editedUser = AuthenticationService.getUser();
                editedUser.firstName = user.firstName;
                editedUser.lastName = user.lastName;
                editedUser.phoneNumber = user.phoneNumber;
                editedUser.role = user.role;
                editedUser.gender = user.gender;
                editedUser.units = user.units;
                editedUser.language = user.language;
                editedUser.firstDayOfWeek = user.firstDayOfWeek;
                editedUser.dateFormat = user.dateFormat;
                AuthenticationService.setUser(editedUser);
                this.localiseService.use(editedUser.language);
                this.userData.next(editedUser);
            }),
        );
    }
}
