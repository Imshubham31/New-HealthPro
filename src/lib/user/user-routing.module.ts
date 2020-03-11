import { NgModule } from '@angular/core';

import { EditUserComponent } from './edit-user/edit-user.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [{ path: 'user', component: EditUserComponent }];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class UserRoutingModule {}
