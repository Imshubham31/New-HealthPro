import { Component, Input } from '@angular/core';
import { Service } from './service';

@Component({
    selector: 'app-modal-checkbox',
    template: `
        <label class="form-checkbox">
            <input
                type="checkbox"
                [checked]="value"
                (change)="handleChange($event)"
            />
            <i class="form-icon"></i> {{ label }}
        </label>
    `,
})
export class ModalCheckboxComponent {
    @Input() label: string;

    value: boolean;

    constructor(private service: Service) {
        service.getValue().subscribe(value => {
            this.value = value;
        });
    }

    handleChange(event) {
        this.value = event.target.checked;
        this.service.onChange(this.value);
    }
}
