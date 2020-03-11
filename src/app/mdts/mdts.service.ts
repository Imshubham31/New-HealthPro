import { MdtsRestService } from './mdts-rest.service';
import { Injectable } from '@angular/core';
import { MDTs } from './mdts.model';
import { Stores } from '@lib/utils/stores';
import { tap, map, first } from 'rxjs/operators';
import { LocaliseService } from '@lib/localise/localise.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class MdtsService extends Stores.StoreService<MDTs> {
    mdts: MDTs;
    constructor(
        private mdtsRestservice: MdtsRestService,
        public localise: LocaliseService,
    ) {
        super();
    }

    private fetchMdts(): void {
        if (!this.cache.isExpired) {
            return;
        }
        super.setStateFetching();
        this.mdtsRestservice
            .find<MDTs>()
            .pipe(
                first(),
                map(mdts => {
                    const list = mdts.data;
                    list.forEach(item => {
                        item.hcps.forEach(hcp => {
                            hcp.fullname = hcp.firstName + ' ' + hcp.lastName;
                        });
                    });
                    this.store$.next({
                        ...this.store$.value,
                        list,
                        isFetching: false,
                    });
                    this.cache.updated();
                }),
            )
            .subscribe();
    }
    getMdts() {
        return this.store$.getValue().list;
    }
    getMdts$(): Observable<Stores.Store<MDTs>> {
        this.fetchMdts();
        return this.store$;
    }
    createMdts(mdts: MDTs) {
        return this.mdtsRestservice.create(mdts).pipe(
            tap(() => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }

    getappMdtId(id: string) {
        return this.store$
            .getValue()
            .list.find(messageTemplate => messageTemplate.id === id);
    }

    updateMdts(id: string, mdts: MDTs) {
        return this.mdtsRestservice
            .patch(id, mdts, { gxpReason: 'new changes' })
            .pipe(
                tap(() => {
                    this.fetchMdtsWithOutCache().subscribe();
                }),
                super.catchErrorAndReset(),
            );
    }
    fetchMdtsWithOutCache() {
        super.setStateFetching();
        return this.mdtsRestservice.find<MDTs>().pipe(
            map(mdts => {
                const list = mdts.data;
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                this.cache.updated();
                return this.store$.getValue().list;
            }),
            super.catchErrorAndReset(),
        );
    }
}
