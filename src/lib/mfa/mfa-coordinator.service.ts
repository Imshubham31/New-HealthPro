import { Injectable } from '@angular/core';
import { MfaService } from './mfa.service';
import { MfaOption } from './mfa-rest.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export enum MfaScreen {
    StartScreen,
    SelectMethod,
    AddPhone,
    AddEmail,
    EnterCode,
    Success,
}

export interface MfaState {
    isRegFlow?: boolean;
    screen?: MfaScreen;
    option?: MfaOption;
    pageNumber?: number;
    pageCount?: number;
    loginEmail?: string;
}
@Injectable()
export class MfaCoordinatorService {
    state: BehaviorSubject<MfaState> = new BehaviorSubject({
        isRegFlow: true,
        screen: null,
        option: null,
        loginEmail: null,
        pageNumber: 1,
        pageCount: 5,
    });
    mfaRegister = this.state.value.isRegFlow;

    constructor(private mfaService: MfaService, private router: Router) {}

    start(loginEmail: string) {
        return this.mfaService.getValidatedOption().pipe(
            tap(option => {
                this.router.navigate(['/mfa']);
                if (!option) {
                    this.goToStartMfa(loginEmail);
                } else {
                    this.updateState({ option, isRegFlow: false });
                    this.goToSelectMethod();
                }
            }),
        );
    }

    updateState(updates: MfaState) {
        this.state.next({
            ...this.state.value,
            ...updates,
        });
        this.mfaRegister = this.state.value.isRegFlow;
    }

    goToStartMfa(loginEmail: string) {
        this.updateState({
            screen: MfaScreen.StartScreen,
            loginEmail,
        });
    }

    goToSelectMethod() {
        this.updateState({
            pageNumber: 2,
            screen: MfaScreen.SelectMethod,
        });
    }

    goToAddPhone() {
        this.updateState({
            pageNumber: 3,
            screen: MfaScreen.AddPhone,
        });
    }

    goToAddEmail() {
        this.updateState({
            pageNumber: 3,
            screen: MfaScreen.AddEmail,
        });
    }

    goToEnterCode() {
        this.updateState({
            pageNumber: 4,
            screen: MfaScreen.EnterCode,
        });
    }

    goToSuccess() {
        this.updateState({
            pageNumber: 5,
            screen: MfaScreen.Success,
        });
    }
}
