import { of } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import {
    MessageTempFormState,
    MessageTempFormContext,
} from './messagetemp-form.d';
import { Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { MessageTemplate } from './../../messagetemplate.model';
import { LocaliseService } from '@lib/localise/localise.service';

export class EditMessageTempState implements MessageTempFormState {
    context: MessageTempFormContext;
    constructor(private localise: LocaliseService) {}
    get title() {
        return this.localise.fromKey('editPrefillTemplate');
    }

    get subTitle() {
        return this.localise.fromKey('forMessages');
    }

    get submitButtonText() {
        return this.localise.fromKey('saveChanges');
    }

    submit() {
        this.context.submit();
        this.context.submitting = true;
        this.context.errors = [];
        this.context.messageService
            .updateMessageTemplate(
                this.context.messageTemplate.id,
                this.buildMessage(),
            )
            .pipe(
                tap(() => {
                    this.context.onSuccess.next();
                    this.context.finish();
                }),
                catchError(error => {
                    this.context.errors = [error.error];
                    return of(error);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    setupForm(): void {
        const controls = {
            caremoduleId: [
                this.context.messageTemplate.caremoduleId,
                [Validators.required],
            ],
            subject: [
                this.context.messageTemplate.subject,
                [Validators.required, NoWhitespaceValidator()],
            ],
            message: [this.context.messageTemplate.message, []],
        };

        this.context.form = this.context.fb.group(controls);
    }

    private buildMessage() {
        const editedMessageTemp: MessageTemplate = new MessageTemplate();
        const formModel = this.context.form.value;
        editedMessageTemp.caremoduleId = formModel.caremoduleId;
        editedMessageTemp.subject = formModel.subject;
        editedMessageTemp.name = this.context.messageTemplate.name;
        editedMessageTemp.message = formModel.message;
        return editedMessageTemp;
    }
}
