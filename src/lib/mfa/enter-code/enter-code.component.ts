import { Component } from '@angular/core';
import { MfaCoordinatorService } from '../mfa-coordinator.service';
import {
    ToastService,
    ToastStyles,
} from '../../shared/components/toast/toast.service';
import { LocaliseService } from '../../localise/localise.service';
import { MfaMethod } from '../mfa-rest.service';
import { MfaService } from '../mfa.service';
import { mergeMap } from 'rxjs/operators';
import { AppCoordinator } from '../../app-coordinator/app-coordinator.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { of } from 'rxjs';

@Component({
    selector: 'enter-code',
    styleUrls: ['./enter-code.component.scss'],
    template: `
        <a class="link" (click)="goBack()">
            <i class="fa fa-arrow-left flip-on-rtl" aria-hidden="true"></i>
            {{ 'backToMethod' | localise }}
        </a>
        <h2>{{ 'insertCode' | localise }}</h2>
        <p>
            {{ confirmationText }}
        </p>
        <input
            autofocus
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            [(ngModel)]="securityCode"
            class="form-input input-lg security-code"
            (keydown)="onKeyDown($event)"
            (paste)="onPaste($event)"
        />
        <p>
            {{ 'didntGetCode' | localise }}
            <a class="resend" (click)="resend()">
                <i class="fa fa-repeat flip-on-rtl" aria-hidden="true"></i>
                {{ 'resendCode' | localise }}
            </a>
        </p>
        <button
            class="btn btn-primary btn-block btn-lg"
            (click)="submit()"
            [disabled]="shouldDisableSubmit()"
        >
            {{ 'authenticate' | localise }}
        </button>
    `,
})
export class EnterCodeComponent {
    constructor(
        private mfaCoordinator: MfaCoordinatorService,
        private mfaService: MfaService,
        private toastService: ToastService,
        private localiseService: LocaliseService,
        private authService: AuthenticationService,
    ) {
        this.toastService.show(
            null,
            this.localiseService.fromKey('mayTakeTwoMinutes'),
            ToastStyles.Warning,
        );
    }

    securityCode = '——————';

    get confirmationText() {
        const destination = this.mfaCoordinator.state.value.option
            .mfaDestination;
        const textOption =
            this.mfaCoordinator.state.value.option.mfaMethod === MfaMethod.sms
                ? 'sentCodeByText'
                : 'sentCodeByEmail';
        return this.localiseService.fromParams(textOption, [destination]);
    }

    onPaste(event: ClipboardEvent) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData
            .getData('text')
            .substr(0, 6)
            .padEnd(6, '—');
        this.securityCode = pastedText;
        event.preventDefault();
    }

    onKeyDown(event: any) {
        if (event.ctrlKey || event.metaKey) {
            return;
        }
        event.preventDefault();
        if (
            (event.keyCode < 48 || event.keyCode > 57) &&
            (event.keyCode < 96 || event.keyCode > 105) &&
            event.key !== 'Backspace'
        ) {
            return;
        }
        let code = this.securityCode.replace(/—/g, '');
        if (event.key !== 'Backspace') {
            code += event.key;
        } else {
            code = code.slice(0, -1);
        }
        code = code.substring(0, 6).padEnd(6, '—');
        this.securityCode = code;
    }

    goBack() {
        this.mfaCoordinator.goToSelectMethod();
    }

    shouldDisableSubmit() {
        return this.securityCode.indexOf('—') !== -1;
    }

    submit() {
        AppCoordinator.loadingOverlay.next({
            loading: true,
            message: this.localiseService.fromKey('verifyingCode'),
        });
        this.mfaService
            .verifyCode(this.securityCode)
            .pipe(
                mergeMap(() => {
                    if (!this.mfaCoordinator.state.value.isRegFlow) {
                        return this.authService.getUserProfile();
                    } else {
                        this.mfaCoordinator.goToSuccess();
                        return of();
                    }
                }),
            )
            .subscribe(
                null,
                () => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('mfaInvalidCode'),
                        ToastStyles.Error,
                    );
                    AppCoordinator.loadingOverlay.next({ loading: false });
                },
                () => AppCoordinator.loadingOverlay.next({ loading: false }),
            );
    }

    resend() {
        this.mfaService
            .sendVerificationCode(this.mfaCoordinator.state.value.option.id)
            .subscribe(() =>
                this.toastService.show(
                    null,
                    this.localiseService.fromKey('mayTakeTwoMinutes'),
                    ToastStyles.Warning,
                ),
            );
    }
}
