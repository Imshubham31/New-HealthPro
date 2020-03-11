// import { HttpHeaders } from '@angular/common/http';
import { AppointmentRestService } from './appointment-rest.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import * as merge from 'lodash/merge';
import { Cache } from '@lib/utils/cache';
import { AppointmentTemplate } from './appointmenttemplate.model';
import { Stores } from '@lib/utils/stores';
// import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
@Injectable({
    providedIn: 'root',
})
export class AppointmentService extends Stores.StoreService<
    AppointmentTemplate
> {
    cache = new Cache();
    newAppointmentTemp: AppointmentTemplate;
    constructor(
        private appointmentRestservice: AppointmentRestService,
        private hospitalrestservice: HospitalsRestService,
    ) {
        super();
    }

    getAppointmentTemplate() {
        return this.appointmentRestservice.find<AppointmentTemplate>().pipe(
            map(appointmenttemplate => {
                const list = appointmenttemplate.data;
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                return list;
            }),
        );
    }
    deleteAppointmentTemplate(id) {
        return this.appointmentRestservice.remove(id).pipe();
    }
    getCaremoduleTitle() {
        return this.hospitalrestservice.findCareModules();
    }
    createAppointmentTemplate(appointmentTemplate: AppointmentTemplate) {
        return this.appointmentRestservice.create(appointmentTemplate).pipe(
            tap(() => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }
    getUpdatedAppointments() {
        return this.store$.getValue().list;
    }
    getappTemplateId(id: string) {
        return this.store$
            .getValue()
            .list.find(appointmentTemplate => appointmentTemplate.id === id);
    }
    updateAppointmentTemplate(
        id: string,
        appointmentTemplate: AppointmentTemplate,
    ) {
        return this.appointmentRestservice
            .patch(id, appointmentTemplate, { gxpReason: 'new changes' })
            .pipe(
                tap(() => {
                    appointmentTemplate.id = id;
                    const updatedAppointmentTemplate: AppointmentTemplate = this.getappTemplateId(
                        appointmentTemplate.id,
                    );
                    merge(updatedAppointmentTemplate, appointmentTemplate);
                    this.updateStoreWithEntity(
                        updatedAppointmentTemplate,
                        'id',
                    );
                }),
                super.catchErrorAndReset(),
            );
    }
}
