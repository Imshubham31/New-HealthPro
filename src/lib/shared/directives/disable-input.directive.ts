import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[disableControlDirective]',
})
export class DisableControlDirective {
    @Input()
    set disableControlDirective(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

    constructor(private ngControl: NgControl) {}
}
