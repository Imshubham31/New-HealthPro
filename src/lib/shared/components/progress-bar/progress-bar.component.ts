import { Component, Input, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'progress-bar',
    templateUrl: 'progress-bar.component.html',
    styleUrls: ['progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
    @Input() currentPage: number;
    @Input() totalPages: number;
    pages: number[];

    constructor() {}

    ngOnInit() {
        this.pages = Array(this.totalPages)
            .fill(0)
            .map((v, i) => i + 1);
    }
}
