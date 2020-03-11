import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-popover',
    template: `
        <div class="popover popover-bottom full-width">
            <ng-content></ng-content>
            <div class="popover-container" *ngIf="active">
                <div class="card">
                    <div class="card-body">{{ body }}</div>
                </div>
            </div>
        </div>
    `,
})
export class PopoverComponent {
    @Input() active = true;
    @Input() body: string;
}
