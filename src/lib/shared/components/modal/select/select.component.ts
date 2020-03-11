import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { Service } from '../service';

@Component({
    selector: 'app-modal-select',
    template: `
        <div class="has-icon-right">
            <input
                id="auto-complete"
                ng2-auto-complete
                [accept-user-input]="false"
                [disabled]="service.disabled$ | async"
                class="form-input"
                [ngModel]="value"
                [source]="options"
                [list-formatter]="listFormatter.bind(this)"
                [match-formatted]="true"
                [value-formatter]="labelFormatter"
                (valueChanged)="handleValueChanged($event)"
                (ngModelChange)="inputChange($event)"
                display-property-name="label"
            />
            <span class="icon-container">
                <i
                    *ngIf="canClear"
                    class="fa fa-times-circle"
                    (click)="clearValue()"
                ></i>
                <i class="fa fa-caret-down"></i>
            </span>
        </div>
    `,
    styleUrls: ['./select.component.scss'],
})
export class ModalSelectComponent implements OnInit, OnChanges {
    @Input() options: Array<any>;
    @Input() matchProperty: string;
    @Input() labelFormatter: (data: any) => string;
    @Input() canClear = false;
    @Output() onChange = new EventEmitter();
    value: any;

    constructor(public service: Service) {}

    ngOnInit() {
        this.service.getValue().subscribe(value => {
            this.updateValue(value);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.updateValue(this.service.getValue().value);
        }
    }

    private updateValue(value: any) {
        // FIXME: expression changed after it was checked
        setTimeout(() => {
            // ng2 dropdown only considers undefined as a value missing
            // marker. If we pass in null it will set the input value to
            // "null".
            if (!value) {
                this.value = undefined;
                return;
            }
            this.value = this.options.find(
                option =>
                    value[this.matchProperty] &&
                    option[this.matchProperty] === value[this.matchProperty],
            );
        }, 0);
    }

    listFormatter(data: any) {
        // TOOD: I had to remove sanitization from this at it was giving considerable performance issues.
        //        Need to find a way of doing it.
        return `<a href="#" class="select-option">${this.labelFormatter(
            data,
        )}</a>`;
    }

    clearValue() {
        this.value = null;
        this.service.onChange(null);
        this.onChange.emit(null);
    }

    handleValueChanged(value: string) {
        // ng2 dropdown will return an empty string if the input is empty - we
        // expect an undefined.
        if (!value) {
            value = undefined;
        }

        // ng2 dropdown will trigger a value changed even if it only reverted it
        if (value === this.value) {
            return;
        }
        // See: https://angular.io/guide/template-syntax#safe-navigation-operator
        // If we were to use an empty string (which the dropdown would return
        // in case of a missing value), we would have to introduce checks for
        // empty strings as well.
        this.value = value;
        this.service.onChange(this.value || null);
        this.onChange.emit(this.value || null);
    }

    inputChange($event) {
        if (this.canClear && !$event) {
            this.value = '';
            this.service.onChange(null);
        }
    }
}
