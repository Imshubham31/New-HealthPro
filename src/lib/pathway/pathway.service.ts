import { Observable } from 'rxjs';

import { tap, map, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Pathway } from './pathway.model';
import { PathwayUtils } from './pathway-utils';
import { Stores } from '../utils/stores';
import { PathwayRestService } from './pathway-rest.service';

interface PathwaysState {
    list: Pathway[];
    isFetching: boolean;
}

@Injectable()
export class PathWayService extends Stores.StoreService<Pathway> {
    constructor(private pathwayRestService: PathwayRestService) {
        super();
    }

    getPathways$(): Observable<PathwaysState> {
        return this.store$.asObservable();
    }

    moveToNextPhase(pathway: Pathway) {
        return this.pathwayRestService
            .patch(pathway.id, {
                id: pathway.id,
                currentSubphaseId: PathwayUtils.getNextSubPhase(pathway).id,
                currentPhaseId: PathwayUtils.getPhaseOfNextSubphase(pathway).id,
            })
            .pipe(
                concatMap(() => {
                    return this.fetchPathway(Number(pathway.id));
                }),
            );
    }

    // TODO: Functions should do one thing only. Gets should only get from the store.
    //       Not conditionally fetch from the server. This needs a refactor.
    getPathwayById$(id: number) {
        const foundPathway = this.store$.value.list.find(
            pathway => pathway && Number(pathway.id) === id,
        );
        if (!foundPathway) {
            return this.fetchPathway(id);
        }
        return this.store$.asObservable().pipe(
            map(store => {
                return store.list.find(pathway => Number(pathway.id) === id);
            }),
        );
    }

    fetchPathway(id: number) {
        super.setStateFetching();
        return this.pathwayRestService.findOne<Pathway>(id).pipe(
            map(res => res.data),
            tap(pathway => {
                this.updateStoreWithEntity(pathway);
            }),
        );
    }
}
