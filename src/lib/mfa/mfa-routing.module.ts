import { NgModule } from '@angular/core';

import { MfaComponent } from './mfa.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [{ path: 'mfa', component: MfaComponent }];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class MfaRoutingModule {}
