import { SharedModule } from '@lib/shared/shared.module';
import { AppointmenttemplateComponent } from './appointment/appointmenttemplate/appointmenttemplate.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateRoutingModule } from './template-routing.module';
import { TemplateListComponent } from './template-list/template-list.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { DataTablesModule } from 'angular-datatables';
import { DeleteApptemplateComponent } from './appointment/delete-apptemplate/delete-apptemplate.component';
import { AppointmentTempFormComponent } from './appointment/appointment-temp-form/appointment-temp-form.component';
import { MessageTemplateComponent } from './message/message-template/message-template.component';
import { DeleteMessagetemplateComponent } from './message/delete-messagetemplate/delete-messagetemplate.component';
import { MessageTempFormComponent } from './message/message-temp-form/message-temp-form.component';
@NgModule({
    declarations: [
        TemplateListComponent,
        AppointmenttemplateComponent,
        DeleteApptemplateComponent,
        AppointmentTempFormComponent,
        MessageTemplateComponent,
        DeleteMessagetemplateComponent,
        MessageTempFormComponent,
    ],
    imports: [
        CommonModule,
        TemplateRoutingModule,
        LocaliseModule,
        DataTablesModule,
        SharedModule,
    ],
    entryComponents: [
        DeleteApptemplateComponent,
        AppointmentTempFormComponent,
        DeleteMessagetemplateComponent,
        MessageTempFormComponent,
    ],
})
export class TemplateModule {}
