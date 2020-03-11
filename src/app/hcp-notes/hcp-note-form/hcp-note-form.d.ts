import { BaseForm } from '@lib/shared/services/base-form';
import { HcpNote } from '../hcp-notes.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { FormBuilder } from '@angular/forms';
import { HcpNotesService } from 'app/hcp-notes/hcp-notes.service';
import { Patient } from 'app/patients/patient.model';

export interface HcpNoteFormState {
    context: BaseForm;
    title: string;
    submitButtonText: string;
    patientId: string;
    submit(): void;
    setupForm(): void;
    disableSubmit(): boolean;
    gxp?: boolean;
    note?: HcpNote;
    confirmCancelText: string;
}

export interface HcpNoteFormContext extends BaseForm {
    localiseService: LocaliseService;
    fb: FormBuilder;
    finish();
    untitledPlaceholder: string;
    notePlaceholder: string;
    noteTitle: string;
    errors: string[];
    noteContents: string;
    hcpNotesService: HcpNotesService;
}
