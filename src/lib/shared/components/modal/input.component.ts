import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

import { Service } from './service';
import { Masks } from '@lib/utils/masks';

@Component({
    selector: 'app-modal-input',
    template: `
        <input
            class="form-input"
            #input
            [maxLength]="maxLength"
            [disabled]="service.disabled$ | async"
            [readonly]="isReadOnly"
            [value]="value"
            [placeholder]="placeholder"
            (input)="handleChange($event)"
        />
    `,
})
export class ModalInputComponent implements AfterViewInit {
    @Input() placeholder = '';
    @Input() maxLength = 255;
    @Input() mask = '';
    @Input() isReadOnly = false;

    @ViewChild('input', { static: true }) input;

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

    ngAfterViewInit(): void {
        if (this.mask) {
            Masks[this.mask](this.input.nativeElement);
        }
    }
}
