import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HcpModule } from './../hcp/hcp.module';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AddMdtComponent } from './add-mdt/add-mdt.component';
import { EditMdtTeamComponent } from './edit-mdt-team/edit-mdt-team.component';
import { MDTRestService } from './mdt-rest.service';
import { MDTService } from './mdt.service';
import { SharedModule } from '@lib/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LocaliseModule,
        ReactiveFormsModule,
        FormsModule,
        HcpModule,
    ],
    declarations: [EditMdtTeamComponent, AddMdtComponent],
    exports: [EditMdtTeamComponent, AddMdtComponent],
    providers: [MDTService, MDTRestService],
    entryComponents: [AddMdtComponent, EditMdtTeamComponent],
})
export class MdtModule {}
