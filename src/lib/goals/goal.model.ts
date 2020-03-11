export enum GoalType {
    weight = 'Weight',
    stepCount = 'DailyRoutine',
}

export class Goal {
    constructor(
        public scheduledActivityId?: string,
        public records?: GoalRecord[],
        public target?: number,
        public phaseId?: string,
        public pathwayId?: string,
        public subphaseId?: string,
        public templateId?: string,
        public templateRevision?: string,
        public initial?: number,
        public id?: string,
        public type: GoalType = GoalType.weight,
    ) {}

    get latestRecordValue(): number {
        if (!this.records || this.records.length <= 0) {
            return null;
        }

        return this.records.sort(
            (a, b) => b.dateTime.valueOf() - a.dateTime.valueOf(),
        )[0].value;
    }

    static map(data: Goal): Goal {
        const records = data.records.map(record => {
            return {
                dateTime: new Date(record.dateTime),
                value: record.value,
                createdDateTime: new Date(record.createdDateTime),
            };
        });
        const goal = new Goal(
            data.scheduledActivityId,
            records,
            data.target,
            data.phaseId,
            data.pathwayId,
            data.subphaseId,
            data.templateId,
            data.templateRevision,
            data.initial,
            data.id,
            data.type,
        );
        return goal;
    }
}

export interface GoalRecord {
    value: number;
    dateTime: Date;
    createdDateTime?: Date;
}

export interface StepRecord {
    startDateTime?: Date;
    endDateTime?: Date;
}
