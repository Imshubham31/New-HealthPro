import { Component, Input } from '@angular/core';

import { Service } from './service';

@Component({
    selector: 'app-modal-textarea',
    template: `
        <textarea
            class="form-input"
            [value]="value"
            [maxLength]="maxLength"
            [rows]="rows"
            (input)="handleChange($event)"
            [placeholder]="placeholder"
        ></textarea>
    `,
    styles: ['textarea { height: auto } '],
})
export class ModalTextareaComponent {
    @Input() placeholder = '';
    @Input() maxLength = 1024;
    @Input() rows: number;

    value: string;

    constructor(public service: Service) {
        service.getValue().subscribe(value => {
            this.value = value;
        });
    }

    handleChange(event) {
        this.value = event.target.value;
        this.service.onChange(this.value);
    }
}
