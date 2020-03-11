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

export class CreateMessageTempState implements MessageTempFormState {
    context: MessageTempFormContext;
    constructor(private localise: LocaliseService) {}
    get title() {
        return this.localise.fromKey('addNewPrefillTemplate');
    }

    get subTitle() {
        return this.localise.fromKey('forMessages');
    }

    get submitButtonText() {
        return this.localise.fromKey('addTemplateToList');
    }

    submit(): void {
        this.context.messageService.newMessageTemp = null;
        this.context.submit();
        this.context.errors = [];
        this.context.submitting = true;
        this.context.messageTemplate = this.buildMessageTemp();
        this.context.messageService
            .createMessageTemplate(this.buildMessageTemp())
            .pipe(
                tap(success => {
                    this.context.messageTemplate.id = success.resourceId.toString();
                    this.context.messageService.newMessageTemp = this.context.messageTemplate;
                    this.context.onSuccess.next();
                    this.context.finish();
                }),
                catchError(err => {
                    this.context.errors.push(err.error);
                    return of(err);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    protected buildControls() {
        const controls = {
            caremoduleId: ['', [Validators.required]],
            subject: ['', [Validators.required, NoWhitespaceValidator()]],
            message: [''],
        };

        return controls;
    }

    setupForm(): void {
        this.context.form = this.context.fb.group(this.buildControls());
    }

    protected buildMessageTemp() {
        const newMessageTemp: MessageTemplate = new MessageTemplate();
        const formModel = this.context.form.value;
        newMessageTemp.caremoduleId = formModel.caremoduleId;
        newMessageTemp.subject = formModel.subject;
        newMessageTemp.name = 'Message Template';
        newMessageTemp.message = formModel.message;
        return newMessageTemp;
    }
}
