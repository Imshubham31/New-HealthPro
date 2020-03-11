import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRestService } from '@lib/jnj-rest/base-rest.service';
import {
  AuthenticationService,
} from '@lib/authentication/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalCodeRestService extends BaseRestService {

  constructor(http: HttpClient) {
    super(http, 'hospitalcodes');
  }
  getHospitalCodeOptions() {
    return super.find<HospitalCodeOption>({ subPath: `?hospitalId=${AuthenticationService.getUser().hospitalId}` });
  }
}


export interface HospitalCodeOption {
  hospitalUuid: string;
  pathway: {
    uuid: string;
    title: string;
  };
  caremodule: {
    uuid: string;
    title: string;
  };
  hospitalCode: string;
}

