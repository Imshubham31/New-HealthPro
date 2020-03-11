import { GoalRecord } from './goal.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';

@Injectable()
export class GoalsRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'goals');
    }

    createRecord(id: string, record: GoalRecord) {
        return super.create<GoalRecord>(record, { subPath: `/${id}/records` });
    }
}
