import { Component } from '@angular/core';
import { AppState } from '../../../app.state';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: '[splash-wrapper]',
    styleUrls: ['splash-wrapper.component.scss'],
    template: `
        <div class="container">
            <div class="columns">
                <div class="column col-12">
                    <div class="card">
                        <div class="columns">
                            <div class="column col-6 col-sm-5 left-splash">
                                <p class="app-name">{{ name }}</p>
                                <p></p>
                            </div>

                            <div class="column col-6 col-sm-7 right-container">
                                <ng-content></ng-content>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class SplashWrapperComponent {
    constructor(private localise: LocaliseService) {}

    name = this.localise.fromKey(AppState.name);
}
