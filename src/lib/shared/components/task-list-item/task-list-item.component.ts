import { Component, Input } from '@angular/core';
import { EducationalContent } from '@lib/pathway/pathway.model';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'task-list-item',
    template: `
        <app-list-item
            class="columns"
            [title]="item.title | truncate: 50"
            [subtitle]="item.description | truncate: 100"
            [iconClass]="getIconClass(item)"
            [iconText]="showIconText ? (getText(item) | uppercase) : null"
            [label]="showLabel ? item.type : null"
        >
        </app-list-item>
    `,
})
export class TaskListItemComponent {
    @Input() item: EducationalContent;
    @Input() showLabel = false;
    @Input() showIconText = false;

    constructor(private localise: LocaliseService) {}

    getIconClass(item: EducationalContent) {
        return item.status === 'COMPLETE'
            ? 'icon-check complete'
            : 'icon-check';
    }

    getText(item: EducationalContent) {
        return item.status === 'COMPLETE'
            ? this.localise.fromKey('done')
            : this.localise.fromKey('toDo');
    }
}
