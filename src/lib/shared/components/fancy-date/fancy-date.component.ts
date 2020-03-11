import { Component, Input } from '@angular/core';

@Component({
    selector: 'fancy-date',
    template: `
        <div class="month">
            {{ date | localisedDate: 'MMM' }}
        </div>
        <div class="day">
            {{ date | localisedDate: 'dd' }}
        </div>
        <div class="year">
            {{ date | localisedDate: 'yyyy' }}
        </div>
    `,
    styleUrls: ['./fancy-date.component.scss'],
})
export class FancyDateComponent {
    @Input() date: Date;
}
