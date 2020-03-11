import { NgModule } from '@angular/core';

import { CareModuleComponent } from '../../app/patients/add-patient/care-module/care-module.component';
import { AuthenticationService } from './authentication.service';
import { UserRestService } from './user-rest.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { UnauthorizedHandler } from './token-refresh/unauthorized-handler';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [HttpClientModule, SharedModule, LocaliseModule],
    providers: [
        AuthenticationService,
        UserRestService,
        CareModuleComponent,
        UnauthorizedHandler,
    ],
})
export class AuthenticationModule {}
