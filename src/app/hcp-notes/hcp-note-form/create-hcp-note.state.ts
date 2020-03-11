import {
    HcpNoteFormContext,
    HcpNoteFormState,
} from 'app/hcp-notes/hcp-note-form/hcp-note-form.d';
import { Validators } from '@angular/forms';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export class CreateHcpNoteState implements HcpNoteFormState {
    gxp?: boolean;
    context: HcpNoteFormContext;
    untitled: string;
    constructor(public patientId: string) {}

    get title() {
        return this.context.localiseService.fromKey('createHcpNote');
    }

    get submitButtonText() {
        return this.context.localiseService.fromKey('createHcpNote');
    }

    get confirmCancelText() {
        return this.context.localiseService.fromKey('confirmCancelCreateNote');
    }

    setupForm(): void {
        this.context.form = this.context.fb.group({
            title: ['', [Validators.required]],
            body: ['', [Validators.required]],
        });
    }

    submit(): void {
        this.context.submit();
        this.context.submitting = true;
        const formValues = this.context.form.value;
        const note = {
            title: formValues.title,
            body: formValues.body,
            patientId: this.patientId,
        };
        this.context.hcpNotesService
            .createNote(this.patientId, note)
            .pipe(
                tap(() => this.context.finish()),
                catchError(err => {
                    this.context.errors.push(
                        this.context.localiseService.fromKey(
                            'createConsultationNoteError',
                        ),
                    );
                    return of(err);
                }),
                tap(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    disableSubmit(): boolean {
        return false;
    }
}
