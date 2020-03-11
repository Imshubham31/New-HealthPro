import { Attachments, ParamsValues } from './attachment.model';

export class Messages {
    constructor(
        public time: Date,
        public body?: string,
        public senderId?: string,
        public attachments?: Attachments[],
        public code?: string,
        public params?: ParamsValues[],
    ) {}
}
