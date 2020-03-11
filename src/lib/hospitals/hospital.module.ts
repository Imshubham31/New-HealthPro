import { HospitalService } from '@lib/hospitals/hospital.service';
import { NgModule } from '@angular/core';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { HospitalGdprDirective } from '@lib/hospitals/hospital-gdpr.directive';
import { HospitalLogoComponent } from '@lib/hospitals/hospital-logo.component';

@NgModule({
    declarations: [HospitalGdprDirective, HospitalLogoComponent],
    providers: [HospitalsRestService, HospitalService],
    exports: [HospitalGdprDirective, HospitalLogoComponent],
})
export class HospitalModule {}
