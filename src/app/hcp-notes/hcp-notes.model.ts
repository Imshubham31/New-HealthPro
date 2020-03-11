import { Restrictable } from './../../lib/authentication/user.model';
interface HcpNoteEvent extends Restrictable {
    id: string;
    datetime: Date;
    firstName: string;
    lastName: string;
}

export class HcpNote {
    constructor(
        public title: string,
        public body: string,
        public patientId: string,
        public created?: HcpNoteEvent,
        public updated?: HcpNoteEvent,
        public id?: string,
    ) {}

    static map(data: HcpNote): HcpNote {
        data.created.datetime = new Date(data.created.datetime);
        data.updated.datetime = new Date(data.updated.datetime);
        return new HcpNote(
            data.title,
            data.body,
            data.patientId,
            data.created,
            data.updated,
            data.id,
        );
    }
}
