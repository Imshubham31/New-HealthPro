import { Component } from '@angular/core';

@Component({
    selector: 'page-header',
    template: `
        <div>
            <ng-content></ng-content>
        </div>
    `,
    styles: ['div { margin-bottom: 1rem }'],
})
export class PageHeaderComponent {}
