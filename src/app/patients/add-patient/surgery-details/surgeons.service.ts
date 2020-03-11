import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatMap, map } from 'rxjs/operators';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { HCPRestService } from '../../../hcp/hcp.rest-service';
import { FindResponse } from '@lib/jnj-rest/base-rest.service';
import { Stores } from '@lib/utils/stores';
import { Surgeon } from './surgeon.model';

@Injectable()
export class SurgeonsService extends Stores.StoreService<Surgeon> {
    constructor(http: HttpClient, private hCPRestService: HCPRestService) {
        super();
    }

    getSurgeon(surgeonId: string): Surgeon {
        return this.store$
            .getValue()
            .list.find(surgeon => surgeon.id === surgeonId);
    }

    getSurgeons$() {
        if (!this.store$.value.isFetching && this.cache.isExpired) {
            return this.fetchSurgeons();
        }
        return this.store$.pipe(map(store => store.list));
    }

    fetchSurgeons() {
        const params = new HttpParams()
            .set('role', 'surgeon')
            .set('hospitalId', AuthenticationService.getUser().hospitalId);
        super.setStateFetching();
        return this.hCPRestService.find<User>({ params }).pipe(
            super.catchErrorAndReset(),
            flatMap((result: FindResponse<User>) => {
                const surgeons = result.data.map(
                    next =>
                        new Surgeon(
                            next.backendId,
                            next.firstName,
                            next.lastName,
                        ),
                );

                this.store$.next({
                    ...this.store$.value,
                    list: surgeons,
                    isFetching: false,
                });
                this.cache.updated();
                return this.store$.pipe(map(store => store.list));
            }),
        );
    }
}
