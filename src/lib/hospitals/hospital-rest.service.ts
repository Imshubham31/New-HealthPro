import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';

@Injectable()
export class HospitalsRestService extends BaseRestService {
    constructor(http: HttpClient) {
        super(http, 'hospitals');
    }

    findCareModules() {
        return super
            .find<CareModuleModel>({
                subPath: `/${
                    AuthenticationService.getUser().hospitalId
                }/caremodules`,
            })
            .map(result => result.data);
    }
}
