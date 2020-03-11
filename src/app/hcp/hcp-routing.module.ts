import { ManageHcpComponent } from './manage-hcp/manage-hcp.component';
import { NgModule } from '@angular/core';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [{ path: 'managehcp', component: ManageHcpComponent }];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class HcpRoutingModule {}
