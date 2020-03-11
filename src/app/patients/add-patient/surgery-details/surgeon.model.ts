import { Restrictable } from '@lib/authentication/user.model';

export class Surgeon implements Restrictable {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    isRestricted?: boolean;

    constructor(id: string, firstName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
