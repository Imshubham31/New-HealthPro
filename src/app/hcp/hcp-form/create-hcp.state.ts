import { of } from 'rxjs';

import { finalize, catchError, tap } from 'rxjs/operators';
import { HcpFormState, HcpFormContext } from './hcp-form.d';
import { Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { Hcp } from '../hcp.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ToastStyles } from '@lib/shared/components/toast/toast.service';

export class CreateHcpState implements HcpFormState {
    context: HcpFormContext;
    get title() {
        return this.context.localiseService.fromKey('addHcpToPlatform');
    }

    get submitButtonText() {
        return this.context.localiseService.fromKey('addHcp');
    }

    submit(): void {
        this.context.submit();
        this.context.errors = [];
        this.context.submitting = true;
        this.context.hcp = this.buildHcp();
        this.context.hcpService
            .createHcp(this.buildHcp())
            .pipe(
                tap(() => this.context.finish()),
                tap(() => {
                    this.context.toastService.show(
                        null,
                        this.context.localiseService.fromParams(
                            'newPatientSuccess',
                            [
                                `${this.context.hcp.firstName} ${
                                    this.context.hcp.lastName
                                }`,
                            ],
                        ),
                        ToastStyles.Success,
                    );
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
            firstName: ['', [Validators.required, NoWhitespaceValidator()]],
            lastName: ['', [Validators.required, NoWhitespaceValidator()]],
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    NoWhitespaceValidator(),
                ],
            ],
            phoneNumber: ['', [Validators.required, Validators.minLength(3)]],
            existingRole: [null],
            otherRole: ['', NoWhitespaceValidator()],
            roleOption: [this.context.existingValues, [Validators.required]],
            language: [null, Validators.required],
        };
        controls[this.context.roleRadioControl] = [
            this.context.existingValues,
            [Validators.required],
        ];
        return controls;
    }

    setupForm(): void {
        this.context.form = this.context.fb.group(this.buildControls());
        setTimeout(() => this.context.form.get('email').enable());
    }

    protected buildHcp() {
        const newHcp = new Hcp();
        const formModel = this.context.form.value;
        newHcp.firstName = formModel.firstName;
        newHcp.lastName = formModel.lastName;
        newHcp.email = formModel.email;
        newHcp.phoneNumber = formModel.phoneNumber;
        newHcp.language = formModel.language;
        newHcp.hospitalId = AuthenticationService.getUser().hospitalId;
        newHcp.role =
            formModel[this.context.roleRadioControl] ===
            this.context.existingValues
                ? formModel.existingRole
                : formModel.otherRole;
        return newHcp;
    }
}
