import { Observable, OperatorFunction } from 'rxjs';

import { tap, map, concatMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as merge from 'lodash/merge';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { Cache } from '@lib/utils/cache';
import { Hcp } from './hcp.model';
import { HCPRestService } from './hcp.rest-service';
import { Stores } from '@lib/utils/stores';

@Injectable()
export class HcpService extends Stores.StoreService<Hcp> {
    hcp: Hcp;
    private params = new HttpParams().set(
        'hospitalId',
        AuthenticationService.getUser().hospitalId,
    );

    cache = new Cache();

    constructor(
        private toastService: ToastService,
        private localiseService: LocaliseService,
        private hcpRestService: HCPRestService,
    ) {
        super();
    }

    createHcp(hcp: Hcp) {
        super.setStateFetching();
        hcp.hospitalId = AuthenticationService.getUser().hospitalId;
        return this.hcpRestService.create(hcp).pipe(
            super.catchErrorAndReset(),
            concatMap(res => this.fetchHcpWithID(String(res.resourceId))),
            tap(() => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }

    update(hcp: Hcp) {
        return this.hcpRestService.patch(hcp.backendId, hcp).pipe(
            tap(() => {
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('userUpdateSuccess'),
                );
                const updatedHcp = this.getHcp(hcp.backendId);
                merge(updatedHcp, hcp);
                this.updateStoreWithEntity(updatedHcp, 'backendId');
            }),
            super.catchErrorAndReset(),
        );
    }

    fetchHcps() {
        if (!this.cache.isExpired) {
            return this.store$.pipe(map(store => store.list));
        }
        super.setStateFetching();
        return this.hcpRestService.find<Hcp>({ params: this.params }).pipe(
            map(hcps => {
                const list = hcps.data;
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                this.cache.updated();
                return this.store$.getValue().list;
            }),
        );
    }

    getHCPs$({
        onlyActiveUsers = true,
        includeLoggedInUser = true,
    }: GetHcpsOptions = {}) {
        return this.store$.pipe(
            this.filterByOptions({ onlyActiveUsers, includeLoggedInUser }),
        );
    }

    getHcp(id: string) {
        return this.store$.getValue().list.find(hcp => hcp.backendId === id);
    }

    fetchHcpWithID(backendId: string): Observable<Hcp> {
        super.setStateFetching();
        return this.hcpRestService.findOne<Hcp>(backendId).pipe(
            map(next => {
                this.updateStoreWithEntity(next.data, 'backendId');
                return next.data;
            }),
            super.catchErrorAndReset(),
        );
    }

    private filterByOptions(
        options: GetHcpsOptions,
    ): OperatorFunction<Stores.Store<Hcp>, Hcp[]> {
        return map((store: Stores.Store<Hcp>) => {
            let list = [...store.list];
            if (options.includeLoggedInUser === false) {
                list = list.filter(
                    hcp =>
                        hcp.backendId !==
                        AuthenticationService.getUser().backendId,
                );
            }

            if (options.onlyActiveUsers === true) {
                list = list.filter(hcp => hcp.isActive === true);
            }

            return list;
        });
    }
}
interface GetHcpsOptions {
    onlyActiveUsers?: boolean;
    includeLoggedInUser?: boolean;
}
