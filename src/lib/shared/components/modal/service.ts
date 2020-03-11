import { BehaviorSubject } from 'rxjs';
import { ValidationErrors } from '@angular/forms';

export class Service {
    validationErrors: ValidationErrors | null;
    changeFn: (_val: any) => void;
    validateFn: () => void;

    private _value = new BehaviorSubject(undefined);
    private _disabled = new BehaviorSubject<boolean>(false);

    getValue() {
        return this._value;
    }

    get disabled$() {
        return this._disabled.asObservable();
    }

    changeValue(value: any) {
        this._value.next(value);
    }

    setDisabled(value: any) {
        this._disabled.next(value);
    }

    onChange(value: any) {
        if (!this.changeFn) {
            return;
        }
        this.changeFn(value);
    }

    setValidationErrors(errors: ValidationErrors | null) {
        this.validationErrors = errors;
        this.validateFn();
    }
}
