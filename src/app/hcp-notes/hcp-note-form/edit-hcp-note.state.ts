import { HcpNoteFormState, HcpNoteFormContext } from './hcp-note-form';
import { HcpNote } from '../hcp-notes.model';
import { Validators } from '@angular/forms';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export class EditHcpNoteState implements HcpNoteFormState {
    context: HcpNoteFormContext;
    gxp = true;
    constructor(public patientId: string, public note: HcpNote) {}

    get title() {
        return this.context.localiseService.fromKey('editHcpNote');
    }

    get submitButtonText() {
        return this.context.localiseService.fromKey('saveChanges');
    }

    get confirmCancelText() {
        return this.context.localiseService.fromKey('confirmCancelEditNote');
    }

    submit() {
        this.context.submit();
        this.context.submitting = true;
        const formValues = this.context.form.value;
        const note = {
            title: formValues.title,
            body: formValues.body,
            patientId: this.patientId,
            id: this.note.id,
        };
        this.context.hcpNotesService
            .updateNote(note, formValues.reason)
            .pipe(
                tap(() => this.context.finish()),
                catchError(err => {
                    this.context.errors.push(
                        this.context.localiseService.fromKey(
                            'updateConsultationNoteError',
                        ),
                    );
                    return of(err);
                }),
                tap(() => (this.context.submitting = false)),
            )
            .subscribe();
    }
    setupForm() {
        this.context.form = this.context.fb.group({
            title: [this.note.title, [Validators.required]],
            body: [this.note.body, [Validators.required]],
            reason: ['', [Validators.required]],
        });
    }

    disableSubmit() {
        return (
            this.context.form.controls['title'].pristine &&
            this.context.form.controls['body'].pristine
        );
    }
}
