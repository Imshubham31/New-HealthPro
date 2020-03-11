import { HcpNote } from 'app/hcp-notes/hcp-notes.model';

export class TestNotes {
    static build(id = '4'): HcpNote {
        return {
            title: 'hello',
            body: 'how are you',
            id,
            patientId: 'tempId',
            created: {
                id: 'test1',
                firstName: 'bob',
                lastName: 'smith',
                datetime: new Date(),
            },
            updated: {
                id: 'test2',
                firstName: 'bob',
                lastName: 'smith',
                datetime: new Date(),
            },
        };
    }
}
