import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { CareModuleModel } from './care-module.model';
import { Stores } from '@lib/utils/stores';

@Injectable()
export class CareModulesService extends Stores.StoreService<CareModuleModel> {
    constructor(private hospitalsRestService: HospitalsRestService) {
        super();
    }

    getCareModules$() {
        return this.store$.asObservable().pipe(
            map(store => {
                return store.list;
            }),
        );
    }

    getCareModuleCount() {
        return this.getCareModules$().pipe(
            map(careModule => careModule.length),
        );
    }

    fetchCareModules$() {
        if (!this.cache.isExpired) {
            return this.store$.pipe(map(store => store.list));
        }
        super.setStateFetching();
        return this.hospitalsRestService.findCareModules().pipe(
            tap(result => {
                this.store$.next({
                    ...this.store$.value,
                    list: result,
                    isFetching: false,
                });
                this.cache.updated();
                return this.store$.value;
            }),
        );
    }
}
