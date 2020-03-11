import { TestParticipantDetails } from './test-participant-details';

export class TestChats {
    static build({
        id = `${Date.now()}`,
        unreadMessages = 0,
        time = new Date(),
    } = {}) {
        return {
            id,
            subject: 'string',
            participantDetails: [
                TestParticipantDetails.build('11'),
                TestParticipantDetails.build('12'),
            ],
            participants: [
                TestParticipantDetails.build('11'),
                TestParticipantDetails.build('12'),
            ],
            messages: [
                {
                    body: 'Message text',
                    time,
                    senderId: '11',
                },
            ],
            unreadMessages,
        };
    }
}
