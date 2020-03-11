import { PasswordRequiredDialogComponent } from './password-required-dialog/password-required-dialog.component';
import { HospitalModule } from './../../lib/hospitals/hospital.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LocaliseModule } from '@lib/localise/localise.module';
import { ConsentModalComponent } from './consent-modal.component';
import { SettingsPageComponent } from './settings-page.component';
import { C4TRouterModule, Routes } from '@lib/router/c4t-router.module';
import { UserPrivacyService } from './user-privacy.service';
import { SharedModule } from '@lib/shared/shared.module';
import { ChangePasswordComponent } from 'app/settings/change-password/change-password.component';
import { LegalDocumentRowComponent } from '@lib/settings/legal-document-row.component';
import { RightToRestrictModalComponent } from './right-to-restrict-modal/right-to-restrict-modal.component';

const routes: Routes = [{ path: 'settings', component: SettingsPageComponent }];

@NgModule({
    declarations: [
        SettingsPageComponent,
        ConsentModalComponent,
        ChangePasswordComponent,
        LegalDocumentRowComponent,
        PasswordRequiredDialogComponent,
        RightToRestrictModalComponent,
    ],
    providers: [UserPrivacyService],
    imports: [
        CommonModule,
        C4TRouterModule.addRoutes(routes),
        LocaliseModule,
        FormsModule,
        SharedModule,
        HospitalModule,
    ],
    entryComponents: [
        ConsentModalComponent,
        ChangePasswordComponent,
        PasswordRequiredDialogComponent,
        RightToRestrictModalComponent,
    ],
})
export class SettingsModule {}
