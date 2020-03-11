import { Surgeon } from './add-patient/surgery-details/surgeon.model';

export class Surgery {
    surgeon: Surgeon;
    startDateTime: Date;

    constructor(surgeon?: Surgeon, startDateTime?: Date) {
        this.surgeon = surgeon;
        this.startDateTime = startDateTime;
    }
}
