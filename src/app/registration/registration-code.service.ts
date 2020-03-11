import { Injectable } from '@angular/core';
import { RESTControls } from '@lib/jnj-rest/base-rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationCodeService {

  constructor(private http: HttpClient
  ) { }

  public restControls = new RESTControls('registrationcodes');

  postRegistrationCode(hospitalCode: HospitalCodes) {
    return this.http.post<ResponseModel>(this.restControls.getUrl(), hospitalCode);
  }
}

export interface HospitalCodes {
  hospitalCode: string;
}

export interface ResponseModel {
  resourceId: string;
  hospitalCode: string;
  registrationCode: string;
  expires: string;
}
