import { Component, forwardRef, Input } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import { Service } from '@lib/shared/components/modal/service';

@Component({
    selector: 'app-modal-form-control',
    template: `
        <div [ngClass]="{ 'has-error': errors.length }">
            <label
                *ngIf="label"
                class="form-label"
                [class.make-bolder]="makeBolder"
                >{{ label }} <span *ngIf="required">*</span
                ><span *ngIf="loading" class="loading"></span>
            </label>
            <ng-content></ng-content>
            <ng-container *ngIf="errors">
                <p *ngFor="let error of errors" class="form-input-hint">
                    {{ error }}
                </p>
            </ng-container>
        </div>
    `,
    providers: [
        Service,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ModalFormControlComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ModalFormControlComponent),
            multi: true,
        },
    ],
    styleUrls: ['./form-control.component.scss'],
})
export class ModalFormControlComponent
    implements ControlValueAccessor, Validator {
    @Input() label: string;
    @Input() required = false;
    @Input() errors: string[] = [];
    @Input() makeBolder = false;
    @Input() loading = false;

    constructor(private service: Service) {}

    writeValue(obj: any): void {
        this.service.changeValue(obj);
    }

    registerOnChange(fn: any): void {
        this.service.changeFn = fn;
    }

    registerOnTouched(fn: any): void {}

    setDisabledState(disabled: boolean) {
        this.service.setDisabled(disabled);
    }

    validate(c: AbstractControl): ValidationErrors {
        return this.service.validationErrors;
    }

    registerOnValidatorChange(fn) {
        this.service.validateFn = fn;
    }
}
