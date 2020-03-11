import { NgModule } from '@angular/core';
import { MdtsOverviewComponent } from './mdts-overview/mdts-overview.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [
    { path: 'managemdts', component: MdtsOverviewComponent },
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class MdtsRoutingModule {}
