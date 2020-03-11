import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-list-item',
    styleUrls: ['./list-item.component.scss'],
    template: `
        <div class="col-auto icon-holder" *ngIf="iconClass">
            <i class="icon {{ iconClass }}"></i>
            <div class="icon-text">{{ iconText }}</div>
        </div>
        <div class="column item">
            <div class="gray-text" *ngIf="date">{{date}}</div>
            <div class="list-item-title" [title]="title">
                <span *ngIf="label">{{ label }}</span>
                {{ title }}
            </div>
            <div class="gray-text list-item-subtitle" [title]="subtitle">
                {{ subtitle }}
            </div>
            <div class="list-item-body" [title]="body">{{ body }}</div>
        </div>
        <div class="column col-1 chevron" *ngIf="chevron">
            <i class="fa fa-chevron-right"></i>
        </div>
    `,
})
export class ListItemComponent {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() body: string;
    @Input() date: Date;
    @Input() iconClass: string;
    @Input() iconText: string;
    @Input() chevron: boolean;
    @Input() label: string;
}
