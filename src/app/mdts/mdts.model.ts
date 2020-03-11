import { Restrictable } from '@lib/authentication/user.model';

export class MDTs {
    id: string;
    name: string;
    hospitalId: string;
    personal: boolean;
    hcps: Hcps[];
    static get searchFields() {
        return ['name', 'hcps.firstName', 'hcps.lastName', 'hcps.fullname'];
    }
}

export interface Hcps extends Restrictable {
    id: string;
    locationUrl: string;
    locationName: string;
    role: string;
    isActive: boolean;
    idmsId: number;
    firstName: string;
    lastName: string;
    hospitalId: string;
    mrn: string;
    isRestricted: boolean;
    profilePictureUri: string;
    isRestrictedRequested: boolean;
    backendId: string;
    fullname?: string;
}
