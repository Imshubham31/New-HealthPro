import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: 'value is only whitespace' };
    };
}
