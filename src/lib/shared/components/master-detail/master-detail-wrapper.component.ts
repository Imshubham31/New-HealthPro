import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-master-detail-wrapper',
    styleUrls: ['./master-detail-wrapper.component.scss'],
    template: `
        <div class="columns col-gapless">
            <div class="column col-1 hide-xl"></div>
            <div class="column col-4">
                <router-outlet name="master"></router-outlet>
            </div>
            <div class="column detail">
                <router-outlet name="detail"></router-outlet>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDetailWrapperComponent {}
