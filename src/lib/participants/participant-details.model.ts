import { User, Restrictable } from '@lib/authentication/user.model';
import { Hcps } from 'app/mdts/mdts.model';

export enum Relation {
    Me = 'ME',
    InMdt = 'INMDT',
    NotInMdt = 'NOTINMDT',
    CareCoordinator = 'CARECOORDINATOR',
    Hcp = 'HCP',
}

export class ParticipantDetails implements Restrictable {
    backendId: string;
    idmsId: number;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role?: string;
    isRestricted?: boolean;
    displayName?: string;
    relation?: Relation;

    static map(user: User | Hcps): ParticipantDetails {
        return {
            backendId: user.backendId,
            idmsId: user.idmsId,
            isActive: user.isActive,
            firstName: user.firstName,
            lastName: user.lastName,
            isRestricted: user.isRestricted,
            displayName: user.firstName + ' ' + user.lastName,
            role: user.role,
        };
    }

    static parse(participantDetails: any): ParticipantDetails {
        if (participantDetails.constructor.name === ParticipantDetails.name) {
            return participantDetails;
        }
        const object = new ParticipantDetails();
        object.backendId = participantDetails.id;
        object.idmsId = participantDetails.idmsId;
        object.isActive = participantDetails.isActive;
        object.firstName = participantDetails.firstName;
        object.lastName = participantDetails.lastName;
        object.isRestricted = participantDetails.isRestricted;
        object.role = participantDetails.role;
        object.displayName = participantDetails.displayName;
        object.relation = participantDetails.relation;
        return object;
    }
}
