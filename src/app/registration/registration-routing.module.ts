import { NgModule } from '@angular/core';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { ManageRegistrationComponent } from './manage-registration/manage-registration.component';

const routes: Routes = [
    { path: 'manageregistration', component: ManageRegistrationComponent }
];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class RegistrationRoutingModule {}
