import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SharedModule } from '@lib/shared/shared.module';
import { HcpNoteFormComponent } from 'app/hcp-notes/hcp-note-form/hcp-note-form.component';

import { HcpNotesDetailComponent } from './hcp-notes-detail/hcp-notes-detail.component';
import { HcpNotesListComponent } from './hcp-notes-list/hcp-notes-list.component';
import { HcpNotesRoutingModule } from './hcp-notes-routing.module';
import { HcpNotesService } from './hcp-notes.service';
import { PatientDetailsHcpNotesComponent } from './patient-details-hcp-notes/patient-details-hcp-notes.component';

@NgModule({
    declarations: [
        PatientDetailsHcpNotesComponent,
        HcpNoteFormComponent,
        HcpNotesListComponent,
        HcpNotesDetailComponent,
    ],
    imports: [
        CommonModule,
        LocaliseModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        HcpNotesRoutingModule,
    ],
    exports: [PatientDetailsHcpNotesComponent],
    providers: [HcpNotesService],
    entryComponents: [HcpNoteFormComponent],
})
export class HcpNotesModule {}
