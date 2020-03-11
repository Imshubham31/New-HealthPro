import { BehaviorSubject, OperatorFunction, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cache } from '../utils/cache';
import * as get from 'lodash/get';

export namespace Stores {
    export interface Store<T> {
        isFetching: boolean;
        list: T[];
        isSaving?: boolean;
        isDeleting?: boolean;
        errors?: string[];
    }

    export class StoreFactory<T> {
        make() {
            const list: T[] = [];
            const isFetching = false;
            return new BehaviorSubject<Store<T>>({
                isFetching,
                list,
            });
        }
    }

    export abstract class StoreService<T> {
        private _store$ = new Stores.StoreFactory<T>().make();
        public cache = new Cache();
        get store$() {
            return this._store$;
        }

        catchErrorAndReset(): OperatorFunction<any, any> {
            return catchError(err => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                    errors: [err],
                });
                return throwError(err);
            });
        }

        swallowError(): OperatorFunction<any, any> {
            return catchError(() => of());
        }

        setStateFetching() {
            this.store$.next({
                ...this.store$.value,
                isFetching: true,
            });
        }

        updateStoreWithList(list: any[]) {
            this.store$.next({
                ...this.store$.value,
                list,
                isFetching: false,
            });
        }

        updateStoreWithEntity(entity: T, id = 'id') {
            const list = [...this.store$.value.list];
            const index = list.findIndex(
                app => get(app, id) === get(entity, id),
            );
            if (index > -1) {
                list[index] = entity;
            } else {
                list.push(entity);
            }
            this.store$.next({
                list,
                isFetching: false,
            });
        }

        removeEntityFromStore(entity: T, id = 'id') {
            const list = [...this.store$.value.list];
            const index = list.findIndex(
                app => get(app, id) === get(entity, id),
            );
            if (index > -1) {
                list.splice(index, 1);
            }
            this.store$.next({
                list,
                isFetching: false,
            });
        }
    }
}
