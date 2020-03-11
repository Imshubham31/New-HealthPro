import { BehaviorSubject } from 'rxjs';
import { SearchRestService } from '../search/search-rest.service';
import { Injectable } from '@angular/core';
import { Stores } from '@lib/utils/stores';
import { tap, map } from 'rxjs/operators';
import { ParticipantDetails } from './participant-details.model';

export enum ParticipantType {
    Patient = 'patient-',
    HCP = 'hcp-',
}
@Injectable()
export class ParticipantsService extends Stores.StoreService<
    ParticipantDetails
> {
    constructor(private searchRestService: SearchRestService) {
        super();
    }

    private categorizedStore$ = new BehaviorSubject<{
        [ParticipantType.Patient]: ParticipantDetails[];
        [ParticipantType.HCP]: ParticipantDetails[];
    }>({
        [ParticipantType.Patient]: [],
        [ParticipantType.HCP]: [],
    });

    filteredStore$(type?: ParticipantType) {
        if (!type) {
            return this.store$.pipe(map(store => store.list));
        }
        return this.categorizedStore$.pipe(map(store => store[type]));
    }

    isFetching$() {
        return this.store$.map(store => store.isFetching);
    }

    fetch(): void {
        if (this.store$.value.isFetching) {
            return;
        }
        super.setStateFetching();
        this.searchRestService
            .findMessageParticipants()
            .pipe(
                map(response =>
                    response.data.map(participant =>
                        ParticipantDetails.parse(participant),
                    ),
                ),
                tap(list => {
                    super.updateStoreWithList(this.sortOnLastName(list));
                    this.categorizedStore$.next({
                        [ParticipantType.HCP]: this.filterParticipants(
                            list,
                            ParticipantType.HCP,
                        ),
                        [ParticipantType.Patient]: this.filterParticipants(
                            list,
                            ParticipantType.Patient,
                        ),
                    });
                }),
                super.catchErrorAndReset(),
                super.swallowError(),
            )
            .subscribe();
    }

    private sortOnLastName(list: ParticipantDetails[]) {
        return list.sort(
            (a: ParticipantDetails, b: ParticipantDetails) =>
                a.lastName
                    .trim()
                    .toUpperCase()
                    .charCodeAt(0) -
                b.lastName
                    .trim()
                    .toUpperCase()
                    .charCodeAt(0),
        );
    }

    private filterParticipants(
        list: ParticipantDetails[],
        ...entities: ParticipantType[]
    ) {
        return list.filter(participant => {
            const idPrefix = participant.backendId.substring(
                0,
                participant.backendId.indexOf('-') + 1,
            ) as ParticipantType;
            return entities.includes(idPrefix);
        });
    }
}
