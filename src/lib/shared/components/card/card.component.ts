import { Component, Input } from '@angular/core';

@Component({
    selector: 'card',
    template: `
        <div class="card">
            <div class="card-header">
                <div class="card-title">{{ title }}</div>
                <div class="card-subtitle">{{ subtitle }}</div>
            </div>
            <div class="card-body">
                <ng-content></ng-content>
            </div>
            <div class="link-container" *ngIf="linkText">
                <a role="button" [routerLink]="linkRoute" class="underline">{{
                    linkText
                }}</a>
            </div>
        </div>
    `,
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @Input() title;
    @Input() subtitle;
    @Input() linkText;
    @Input() linkRoute;
}
