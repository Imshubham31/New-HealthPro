import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateRegistrationCodeComponent } from './generate-registration-code/generate-registration-code.component';
import { ManageRegistrationComponent } from './manage-registration/manage-registration.component';
import { RegistrationRoutingModule } from './registration-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '@lib/shared/shared.module';
import { LocaliseModule } from '@lib/localise/localise.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Service } from '@lib/shared/components/modal/service';

@NgModule({
  declarations: [GenerateRegistrationCodeComponent, ManageRegistrationComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    DataTablesModule,
    SharedModule,
    LocaliseModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    GenerateRegistrationCodeComponent
  ],
  providers: [
    Service
  ]
})
export class RegistrationModule { }
