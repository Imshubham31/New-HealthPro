import { Component } from '@angular/core';
import { MfaCoordinatorService } from '../mfa-coordinator.service';

@Component({
    selector: 'start-mfa',
    styleUrls: ['./start-mfa.component.scss'],
    template: `
        <h2>{{ 'addExtraSecurity' | localise }}</h2>
        <img src="../../../assets/icon-security.svg" />
        <p>{{ 'mfaDescription' | localise }}</p>
        <button
            class="btn btn-primary btn-block btn-lg"
            (click)="mfaCoordinator.goToSelectMethod()"
        >
            {{ 'activateMfa' | localise }}
        </button>
    `,
})
export class StartMfaComponent {
    constructor(public mfaCoordinator: MfaCoordinatorService) {}
}
