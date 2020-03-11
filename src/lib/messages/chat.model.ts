import { Messages } from './message.model';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export class Chat {
    id: number | string;
    subject: string;
    participantDetails?: ParticipantDetails[];
    participants: ParticipantDetails[];
    messages: Messages[];
    unreadMessages?: number;

    static get searchFields() {
        return ['subject', 'messages.body', 'participantDetails.displayName'];
    }
}
