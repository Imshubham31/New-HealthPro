import { Component } from '@angular/core';
import {
    MfaCoordinatorService,
    MfaState,
    MfaScreen,
} from './mfa-coordinator.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';
import { StartMfaComponent } from './start-mfa/start-mfa.component';
import { SelectMethodComponent } from './select-method/select-method.component';
import { AddPhoneComponent } from './add-phone/add-phone.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EnterCodeComponent } from './enter-code/enter-code.component';
import { MfaSuccessComponent } from './mfa-success/mfa-success.component';

@Component({
    selector: 'app-mfa',
    styleUrls: ['./mfa.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
        ]),
    ],
    template: `
        <div splash-wrapper>
            <ng-container
                *ngxComponentOutlet="component"
                [@fadeIn]
            ></ng-container>
            <progress-bar
                *ngIf="mfaCoordinator.state.value.isRegFlow"
                [currentPage]="mfaCoordinator.state.value.pageNumber"
                [totalPages]="mfaCoordinator.state.value.pageCount"
            ></progress-bar>
        </div>
    `,
})
@Unsubscribe()
export class MfaComponent {
    private subscriptions: Subscription[] = [];
    component;

    constructor(public mfaCoordinator: MfaCoordinatorService) {
        this.subscriptions.push(
            this.mfaCoordinator.state.subscribe((state: MfaState) =>
                this.setComponent(state.screen),
            ),
        );
    }

    setComponent(screen: MfaScreen) {
        switch (screen) {
            case MfaScreen.StartScreen:
                this.component = StartMfaComponent;
                break;
            case MfaScreen.SelectMethod:
                this.component = SelectMethodComponent;
                break;
            case MfaScreen.AddPhone:
                this.component = AddPhoneComponent;
                break;
            case MfaScreen.AddEmail:
                this.component = AddEmailComponent;
                break;
            case MfaScreen.EnterCode:
                this.component = EnterCodeComponent;
                break;
            case MfaScreen.Success:
                this.component = MfaSuccessComponent;
                break;
            default:
                this.mfaCoordinator.start('').subscribe();
        }
    }
}
