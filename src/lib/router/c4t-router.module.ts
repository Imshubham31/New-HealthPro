import { HomeRedirectComponent } from './../shared/components/home-redirect/home-redirect.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { TokenRefreshService } from './token-refresh.service';
import { LoginComponent } from '@lib/shared/components/login/login.component';
import { LoginGuard } from './login.guard';
import { ForgotPasswordComponent } from '@lib/shared/components/login/forgot-password/forgot-password.component';
// tslint:disable-next-line: comment-format
//import { CookiePolicyComponent } from '../shared/components/cookie-policy/cookie-policy.component';

export { Routes } from '@angular/router';

export const defaultRoute = 'login';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: HomeRedirectComponent,
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [LoginGuard],
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                canActivate: [LoginGuard],
            },
            // {
            //     path: 'cookie-policy',
            //     component: CookiePolicyComponent,
            //     canActivate: [LoginGuard],
            // }
        ]),
    ],
    exports: [RouterModule],
    providers: [TokenRefreshService, LoginGuard],
})
export class C4TRouterModule {
    static addRoutes(routes: Routes): ModuleWithProviders {
        return RouterModule.forRoot([
            {
                path: '',
                children: routes,
                canActivateChild: [TokenRefreshService],
            },
        ]);
    }
}
