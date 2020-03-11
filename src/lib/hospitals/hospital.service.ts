import { tap, map, first, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { Stores } from '@lib/utils/stores';
import { Hospital } from './hospital.model';
import { oc } from 'ts-optchain';

@Injectable()
export class HospitalService extends Stores.StoreService<Hospital> {
    hospital = new BehaviorSubject<Hospital>({});

    constructor(private hospitalsRestService: HospitalsRestService) {
        super();
    }

    private fetch(): void {
        if (this.fetchedHospital) {
            return;
        }
        const user = AuthenticationService.getUser();
        this.hospitalsRestService
            .findOne<Hospital>(user.hospitalId)
            .pipe(
                first(),
                map(res => res.data),
                tap(hospitalRes => {
                    const hospitalUpdated = {
                        ...this.hospital.value,
                        ...hospitalRes,
                    };
                    this.store$.next({
                        ...this.store$.value,
                        list: [hospitalUpdated],
                    });
                    this.hospital.next(hospitalUpdated);
                }),
            )
            .subscribe();
    }

    get fetchedHospital(): Hospital {
        return this.store$.getValue().list[0];
    }

    fetchHospital(): Observable<Hospital> {
        this.fetch();
        return this.store$.pipe(
            filter(store => !store.isFetching),
            map(store => store.list[0]),
        );
    }

    canAddPatient() {
        return this.hospital.pipe(
            map(hospital => !oc(hospital).autoPatientEnrollment(true)),
        );
    }
}
