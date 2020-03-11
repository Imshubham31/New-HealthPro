import { HcpNoteFormContext, HcpNoteFormState } from './hcp-note-form.d';
import { BaseForm } from '@lib/shared/services/base-form';
import { ViewChild, Component } from '@angular/core';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { FormBuilder } from '@angular/forms';
import { HcpNotesService } from 'app/hcp-notes/hcp-notes.service';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    templateUrl: './hcp-note-form.component.html',
    styleUrls: ['./hcp-note-form.component.scss'],
})
export class HcpNoteFormComponent extends BaseForm
    implements HcpNoteFormContext, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    state: HcpNoteFormState;
    untitledPlaceholder = this.localiseService.fromKey('untitled');
    notePlaceholder = this.localiseService.fromKey('writeConsultationNotes');
    noteTitle = this.localiseService.fromKey('noteTitle');
    noteContents = this.localiseService.fromKey('noteContents');
    errors: string[] = [];
    showPopover = false;

    constructor(
        public localiseService: LocaliseService,
        public fb: FormBuilder,
        public hcpNotesService: HcpNotesService,
    ) {
        super();
    }

    submit() {
        super.submit();
        this.errors = [];
    }

    open() {
        this.state.context = this;
        this.state.setupForm();
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
        this.cleanForm();
    }

    cleanForm() {
        super.cleanForm();
    }

    finish() {
        this.close();
    }

    handleCancel() {
        if (this.state.context.form.pristine) {
            this.modal.closeModal();
        }
        this.showPopover = true;
    }

    handleConfirmation(confirmed: boolean) {
        if (confirmed) {
            this.modal.closeModal();
        }
        this.showPopover = false;
    }

    shouldDisableSubmit() {
        return super.shouldDisableSubmit() || this.state.disableSubmit();
    }

    get body() {
        if (!this.state.context.form) {
            return '';
        }
        return this.state.context.form.value.body || '';
    }
}
