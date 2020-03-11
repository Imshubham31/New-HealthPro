import { PathwayUtils } from '@lib/pathway/pathway-utils';
import { Component } from '@angular/core';
import { ProgressComponent } from './progress.component';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'task-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
})
export class TaskProgressComponent extends ProgressComponent {
    constructor(private localize: LocaliseService) {
        super();
    }

    fetchValue() {
        const progress = PathwayUtils.getCurrentEducationalProgress(
            this.pathway,
        );
        this.centerText = `
            ${progress.completed.toLocaleString(this.localize.getLocale())} /
            ${progress.total.toLocaleString(this.localize.getLocale())}`;
        this.currentValue = progress.completed;
        this.max = progress.total;
    }
}
