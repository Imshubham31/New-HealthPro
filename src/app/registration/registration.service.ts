import { Injectable } from '@angular/core';
import { Cache } from '@lib/utils/cache';
import { Stores } from '@lib/utils/stores';
import { PatientRegistration } from './patient-registration.model';
import { RegistrationRestService } from './registration-rest.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends Stores.StoreService<PatientRegistration> {

  cache = new Cache();
    constructor(
        private registrationRestservice: RegistrationRestService
    ) {
        super();
    }

    getRegistrationlist() {
      return this.registrationRestservice.find<PatientRegistration>({subPath: '/self-registered'}).pipe(
          map(registrationdata => {
              const list   = registrationdata.data;
              this.store$.next({
                  ...this.store$.value,
                  list,
                  isFetching: false,
              });
              return list;
          }),
      );
  }
}
