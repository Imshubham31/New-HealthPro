import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocaliseModule } from '@lib/localise/localise.module';
import { HcpFormComponent } from './hcp-form/hcp-form.component';
import { HcpRoutingModule } from './hcp-routing.module';
import { HCPRestService } from './hcp.rest-service';
import { HcpService } from './hcp.service';
import { HcpActionsCardComponent } from './manage-hcp/hcp-actions-card/hcp-actions-card.component';
import { HcpContactInfoComponent } from './manage-hcp/hcp-contact-info/hcp-contact-info.component';
import { ManageHcpComponent } from './manage-hcp/manage-hcp.component';
import { SharedModule } from '@lib/shared/shared.module';
import { HcpAppointmentsModule } from '../appointments/appointments.module';
import { HcpMessagesModule } from '../messages/messages.module';
import { HcpMessagesService } from '../messages/messages.service';
import { HospitalModule } from './../../lib/hospitals/hospital.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HcpRoutingModule,
        LocaliseModule,
        FormsModule,
        ReactiveFormsModule,
        HcpAppointmentsModule,
        HcpMessagesModule,
        HospitalModule,
    ],
    declarations: [
        ManageHcpComponent,
        HcpContactInfoComponent,
        HcpActionsCardComponent,
        HcpFormComponent,
    ],
    providers: [HcpService, HCPRestService, HcpMessagesService],
    entryComponents: [HcpFormComponent],
})
export class HcpModule {}
