import { LocaliseService } from './../../localise/localise.service';
import { Component, OnInit } from '@angular/core';
import { MfaCoordinatorService } from '../mfa-coordinator.service';
import { MfaService } from '../mfa.service';
import { finalize, map } from 'rxjs/operators';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { MfaMethod } from '../mfa-rest.service';

@Component({
    selector: 'select-method',
    styleUrls: ['./select-method.component.scss'],
    template: `
        <div *ngIf="mfaRegisterTxt">
            <h2>{{ 'whichMfaMethod' | localise }}</h2>
            <p>{{ 'newMfaUserDesc1' | localise }}</p>
            <p>{{ 'newMfaUserDesc2' | localise }}</p>
        </div>
        <div *ngIf="!mfaRegisterTxt" class="mfa-sigin">
            <h2>{{ 'signinCodeRequired' | localise }}</h2>
            <p>{{ 'securityCodeRequired' | localise }}</p>
        </div>
        <button
            (click)="goToVerfiyCode()"
            *ngIf="!mfaCoordinator.state.value.isRegFlow; else selectNew"
        >
            <img src="../../../assets/mfa-phone.svg" />
            <span>
                <p>
                    {{ currentMethodMessage | async | localise }}
                </p>
                <p class="subtitle">
                    {{
                        'mfaSendCodeTo'
                            | localise
                                : [
                                      mfaCoordinator.state.value.option
                                          .mfaDestination
                                  ]
                    }}
                </p>
            </span>
        </button>
        <ng-template #selectNew>
            <button (click)="mfaCoordinator.goToAddPhone()" class="btn-mobile">
                <img src="../../../assets/mfa-phone.svg" />
                <span>
                    <p>{{ 'textMe' | localise }}</p>
                    <p class="subtitle">{{ 'textMeSubtitle' | localise }}</p>
                </span>
            </button>
            <button (click)="mfaCoordinator.goToAddEmail()" class="btn-email">
                <img src="../../../assets/mfa-email.svg" />
                <span>
                    <p>{{ 'emailMe' | localise }}</p>
                    <p class="subtitle">{{ 'emailMeSubtitle' | localise }}</p>
                </span>
            </button>
        </ng-template>
    `,
})
export class SelectMethodComponent implements OnInit {
    constructor(
        public mfaCoordinator: MfaCoordinatorService,
        private mfaService: MfaService,
        private toastServce: ToastService,
        private locaiseService: LocaliseService,
    ) {}

    mfaRegisterTxt;
    ngOnInit() {
        this.mfaRegisterTxt = this.mfaCoordinator.mfaRegister;
    }
    get currentMethodMessage() {
        return this.mfaCoordinator.state.pipe(
            map(state => {
                switch (state.option.mfaMethod) {
                    case MfaMethod.email:
                        return 'emailMe';
                    case MfaMethod.sms:
                        return 'textMe';
                }
            }),
        );
    }

    goToVerfiyCode() {
        AppCoordinator.loadingOverlay.next({
            loading: true,
            hideMessage: true,
        });
        this.mfaService
            .sendVerificationCode(this.mfaCoordinator.state.value.option.id)
            .pipe(
                finalize(() =>
                    AppCoordinator.loadingOverlay.next({ loading: false }),
                ),
            )
            .subscribe(
                () => this.mfaCoordinator.goToEnterCode(),
                () => {
                    const { option } = this.mfaCoordinator.state.value;
                    let message = 'defaultError';
                    switch (option.mfaMethod) {
                        case MfaMethod.email:
                            message = this.locaiseService.fromKey(
                                'mfaUnableToVerifyEmail',
                            );
                            break;
                        case MfaMethod.sms:
                            message = this.locaiseService.fromKey(
                                'mfaUnableToVerifyPhoneNumber',
                            );
                            break;
                    }

                    this.toastServce.show(null, message, ToastStyles.Error);
                },
            );
    }
}
