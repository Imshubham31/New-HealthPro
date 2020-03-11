import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'mfa-success',
    styleUrls: ['./mfa-success.component.scss'],
    template: `
        <img src="../../../assets/consent_done.svg" />
        <h2>{{ 'mfaSuccess' | localise }}</h2>
        <button
            class="btn btn-primary btn-block btn-lg"
            (click)="getUser()"
            [disabled]="submitting"
            [class.loading]="submitting"
        >
            {{ 'continue' | localise }}
        </button>
    `,
})
export class MfaSuccessComponent {
    submitting = false;

    constructor(private authService: AuthenticationService) {}

    getUser() {
        this.submitting = true;
        this.authService
            .getUserProfile()
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe();
    }
}
