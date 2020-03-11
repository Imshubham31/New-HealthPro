import {
    Relation,
    ParticipantDetails,
} from '@lib/participants/participant-details.model';

export class TestParticipantDetails {
    static build(
        backendId = '1',
        isActive = true,
        relation = Relation.InMdt,
        lastName = `lastName${backendId}`,
    ): ParticipantDetails {
        return {
            backendId,
            idmsId: Date.now(),
            firstName: `firstName${backendId}`,
            lastName,
            isActive,
            relation: relation,
        };
    }
}
