import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HospitalCodeRestService, HospitalCodeOption } from './hospital-code-rest.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalCodeService {

  constructor(private hospitalCodeRestService: HospitalCodeRestService) { }

  public getHospitalCodes(): Observable<HospitalCodeOption> {
    return this.hospitalCodeRestService
      .getHospitalCodeOptions()
      .pipe(map(res => (res.data as any).filter(option => option.hospitalCode !== '')));
  }
}
