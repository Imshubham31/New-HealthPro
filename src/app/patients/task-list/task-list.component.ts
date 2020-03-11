import { Component, Input } from '@angular/core';

import { PathwayUtils } from '@lib/pathway/pathway-utils';
import { Pathway } from '@lib/pathway/pathway.model';

@Component({
    selector: 'task-list',
    templateUrl: './task-list.component.html',
})
export class TaskListComponent {
    @Input() pathway: Pathway;

    pathwayUtils = PathwayUtils;
}
