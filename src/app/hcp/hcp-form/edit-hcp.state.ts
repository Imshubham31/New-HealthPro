import { of } from 'rxjs';

import { finalize, catchError, tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';

import { NoWhitespaceValidator } from '@lib/utils/validators';
import { Hcp } from '../hcp.model';
import { HcpFormContext, HcpFormState } from './hcp-form.d';

export class EditHcpState implements HcpFormState {
    context: HcpFormContext;
    get title() {
        return this.context.localiseService.fromKey('editHcpsProfile');
    }

    get submitButtonText() {
        return this.context.localiseService.fromKey('saveChanges');
    }

    submit() {
        this.context.submit();
        this.context.submitting = true;
        this.context.errors = [];
        this.context.hcpService
            .update(this.buildHcp())
            .pipe(
                tap(() => this.context.finish()),
                catchError(error => {
                    this.context.errors = [error.error];
                    return of(error);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    setupForm(): void {
        const userRoleFromList = this.context.userRoles.find(
            n => n === this.context.hcp.role.toLowerCase(),
        );
        const controls = {
            firstName: [
                this.context.hcp.firstName,
                [Validators.required, NoWhitespaceValidator()],
            ],
            lastName: [
                this.context.hcp.lastName,
                [Validators.required, NoWhitespaceValidator()],
            ],
            email: [
                this.context.hcp.email,
                [
                    Validators.required,
                    Validators.email,
                    NoWhitespaceValidator(),
                ],
            ],
            phoneNumber: [
                this.context.hcp.phoneNumber,
                [Validators.required, Validators.minLength(3)],
            ],
            existingRole: [userRoleFromList || null],
            otherRole: [!userRoleFromList ? this.context.hcp.role : ''],
        };
        controls[this.context.roleRadioControl] = [
            userRoleFromList
                ? this.context.existingValues
                : this.context.otherValue,
            [Validators.required],
        ];
        this.context.form = this.context.fb.group(controls);
        setTimeout(() => this.context.form.get('email').disable());
    }

    private buildHcp() {
        const editedHcp = new Hcp();
        const formModel = this.context.form.value;
        editedHcp.backendId = this.context.hcp.backendId;
        editedHcp.idmsId = this.context.hcp.idmsId;
        editedHcp.firstName = formModel.firstName;
        editedHcp.lastName = formModel.lastName;
        editedHcp.phoneNumber = formModel.phoneNumber;
        editedHcp.role =
            formModel[this.context.roleRadioControl] ===
            this.context.existingValues
                ? formModel.existingRole
                : formModel.otherRole;
        return editedHcp;
    }
}
