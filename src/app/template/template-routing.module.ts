import { MessageTemplateComponent } from './message/message-template/message-template.component';
import { AppointmenttemplateComponent } from './appointment/appointmenttemplate/appointmenttemplate.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { NgModule } from '@angular/core';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [
    { path: 'managetemplate', component: TemplateListComponent },
    { path: 'appointmenttemplate', component: AppointmenttemplateComponent },
    { path: 'messagetemplate', component: MessageTemplateComponent },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class TemplateRoutingModule {}
