import { AfterViewInit, Component, ElementRef } from '@angular/core';

import { Masks } from '@lib/utils/masks';
import { Service } from './service';

@Component({
    selector: 'app-modal-timepicker',
    template: `
        <div class="input">
            <input
                class="form-input"
                [disabled]="service.disabled$ | async"
                (input)="handleTimeChange()"
                [value]="value | date: 'hh:mm'"
                (blur)="handleBlur()"
            />
        </div>
        <div class="meridian btn-group btn-group-block margin-start-1">
            <button
                type="button"
                class="btn"
                [ngClass]="{ active: isAm }"
                [disabled]="service.disabled$ | async"
                (click)="useAM()"
            >
                {{ 'am' | localise }}
            </button>
            <button
                type="button"
                class="btn"
                [ngClass]="{ active: !isAm }"
                [disabled]="service.disabled$ | async"
                (click)="usePM()"
            >
                {{ 'pm' | localise }}
            </button>
        </div>
    `,
    styles: [
        ':host { display: flex }',
        '.meridian { flex: 1 1 40% }',
        '.meridian .btn { padding: 0 }',
    ],
})
export class ModalTimepickerComponent implements AfterViewInit {
    isAm = true;
    value: Date;

    private input: HTMLInputElement;
    private mask: any = {
        isComplete: () => false, // mask null object
    };

    constructor(private element: ElementRef, public service: Service) {}

    ngAfterViewInit() {
        this.input = this.element.nativeElement.querySelector('input');

        this.mask = Masks.time(this.input);

        // ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.service.getValue().subscribe((date: Date) => {
                if (date) {
                    this.isAm = date.getHours() < 12;
                }
                this.value = date;
            });
        }, 0);
    }

    useAM() {
        this.isAm = true;
        this.handleTimeChange();
    }

    usePM() {
        this.isAm = false;
        this.handleTimeChange();
    }

    handleTimeChange() {
        if (this.mask.isComplete()) {
            this.value = this.convertMaskToDate(this.input.value);
            this.service.onChange(this.value);
        } else {
            this.service.onChange(null);
        }
    }

    handleBlur() {
        if (!this.mask.isComplete()) {
            this.value = null;
            this.isAm = true;
            this.service.onChange(this.value);
        }
    }

    private convertMaskToDate(mask) {
        const [, hours, minutes] = mask.match(/(\d+):(\d+)/);
        const date = new Date();

        let hours24;
        if (this.isAm) {
            if (hours === '12') {
                hours24 = 0;
            } else {
                hours24 = Number(hours);
            }
        } else {
            if (hours === '12') {
                hours24 = 12;
            } else {
                hours24 = Number(hours) + 12;
            }
        }

        date.setHours(hours24, Number(minutes), 0, 0);

        return date;
    }
}
