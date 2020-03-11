import { HcpNotesDetailComponent } from './hcp-notes-detail/hcp-notes-detail.component';
import { HcpNotesListComponent } from './hcp-notes-list/hcp-notes-list.component';
import { NgModule } from '@angular/core';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { MasterDetailWrapperComponent } from '@lib/shared/components/master-detail/master-detail-wrapper.component';

const routes: Routes = [
    {
        path: 'patients/:id/consultation-notes',
        component: MasterDetailWrapperComponent,
        children: [
            {
                path: 'all',
                component: HcpNotesListComponent,
                outlet: 'master',
            },
            {
                path: ':noteId',
                component: HcpNotesDetailComponent,
                outlet: 'detail',
            },
        ],
    },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class HcpNotesRoutingModule {}
