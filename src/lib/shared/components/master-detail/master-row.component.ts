import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'master-row',
    template: `
        <div class="row">
            <div id="masterRowDate" class="col-12 row-date" *ngIf="date">
                {{ date }}
            </div>
            <div class="col-12 row-title">{{ title | truncate: 50 }}</div>
            <div class="col-12 row-body container">
                <div class="col-11 row-body">{{ body | truncate: 120 }}</div>
            </div>
        </div>
    `,
    styleUrls: ['./master-row.component.scss'],
})
export class MasterRowComponent {
    @Input() title: string;
    @Input() body: string;
    @Input() date: Date;
    @HostBinding('class.selected')
    @Input()
    selected = false;

    constructor() {}
}
