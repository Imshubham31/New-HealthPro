import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MfaComponent } from './mfa.component';
import { MfaRoutingModule } from './mfa-routing.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { MfaService } from './mfa.service';
import { MfaRestService } from './mfa-rest.service';
import { SharedModule } from '../shared/shared.module';
import { LocaliseModule } from '../localise/localise.module';
import { StartMfaComponent } from './start-mfa/start-mfa.component';
import { SelectMethodComponent } from './select-method/select-method.component';
import { AddPhoneComponent } from './add-phone/add-phone.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { MfaCoordinatorService } from './mfa-coordinator.service';
import { EnterCodeComponent } from './enter-code/enter-code.component';
import { MfaSuccessComponent } from './mfa-success/mfa-success.component';
import { NgxdModule } from '@ngxd/core';

@NgModule({
    imports: [
        CommonModule,
        MfaRoutingModule,
        SharedModule,
        LocaliseModule,
        FormsModule,
        NgxdModule,
    ],
    declarations: [
        MfaComponent,
        StartMfaComponent,
        SelectMethodComponent,
        AddPhoneComponent,
        AddEmailComponent,
        EnterCodeComponent,
        MfaSuccessComponent,
    ],
    providers: [
        MfaService,
        MfaRestService,
        LocaliseService,
        MfaCoordinatorService,
    ],
    entryComponents: [
        StartMfaComponent,
        SelectMethodComponent,
        AddPhoneComponent,
        AddEmailComponent,
        EnterCodeComponent,
        MfaSuccessComponent,
    ],
})
export class MfaModule {}
