import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from '../service';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'app-modal-language-picker',
    templateUrl: './language-picker.component.html',
})
export class LanguagePickerComponent {
    formControl = new FormControl();

    constructor(
        public service: Service,
        public localiseService: LocaliseService,
    ) {
        service.getValue().subscribe(value => {
            this.formControl.setValue(value, { emitEvent: false });
        });
        service.disabled$.subscribe(disabled => {
            this.formControl[disabled ? 'disable' : 'enable']();
        });
        this.formControl.valueChanges.subscribe(() => this.notifyService());
    }

    private notifyService() {
        this.service.onChange(this.formControl.value);
    }
}
