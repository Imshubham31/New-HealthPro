import { NgModule } from '@angular/core';

import { OnboardingComponent } from './onboarding.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';

const routes: Routes = [{ path: 'onboarding', component: OnboardingComponent }];

@NgModule({
    imports: [C4TRouterModule.addRoutes(routes)],
    exports: [C4TRouterModule],
})
export class OnboardingRoutingModule {}
