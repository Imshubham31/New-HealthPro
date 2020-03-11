import { User } from '@lib/authentication/user.model';

export class Hcp extends User {
    locationUrl?: string;
    locationName?: string;

    static get searchFields() {
        return ['fullName', 'email', 'role', 'locationUrl', 'locationName'];
    }
}
