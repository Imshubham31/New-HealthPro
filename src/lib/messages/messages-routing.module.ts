import { AllMessagesContainerComponent } from '@lib/messages/all-messages-container/all-messages-container.component';
import { NgModule } from '@angular/core';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { PatientMessagesContainerComponent } from './patient-messages-container/patient-messages-container.component';
import { MasterDetailWrapperComponent } from '@lib/shared/components/master-detail/master-detail-wrapper.component';

const routes: Routes = [
    {
        path: 'messages',
        component: MasterDetailWrapperComponent,
        children: [
            {
                path: 'all',
                component: AllMessagesContainerComponent,
                outlet: 'master',
            },
            {
                path: '',
                component: PatientMessagesContainerComponent,
                outlet: 'detail',
            },
            {
                path: ':id',
                component: PatientMessagesContainerComponent,
                outlet: 'detail',
            },
        ],
    },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class MessagesRoutingModule {}
