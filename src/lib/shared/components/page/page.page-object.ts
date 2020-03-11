import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class PagePageObject {
    constructor(private host: DebugElement) {}

    get page() {
        return this.host.query(By.css('page-container'));
    }

    get actionButton() {
        return this.host.query(By.css('page-action-button'));
    }

    get before() {
        return this.host.query(By.css('page-header'));
    }

    get content() {
        return this.host.query(By.css('page-content'));
    }
}
