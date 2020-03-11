import { throwError as observableThrowError, Subject } from 'rxjs';

import { catchError, tap, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import * as merge from 'lodash/merge';
import { environment } from '../../environments/environment';
import { LocaliseService } from '@lib/localise/localise.service';
import { FindOneResponse } from '@lib/jnj-rest/base-rest.service';
import { User } from './user.model';
import { AppState } from '../../app.state';
import { oc } from 'ts-optchain';
import { MfaCoordinatorService } from '../mfa/mfa-coordinator.service';
import { ChangePasswordComponent } from '../../app/settings/change-password/change-password.component';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';

@Injectable()
export class AuthenticationService {
    static onLoginSuccess = new Subject<User>();

    constructor(
        private http: HttpClient,
        private localiseService: LocaliseService,
        private mfaCoordinator: MfaCoordinatorService,
        private modalService: ModalService,
        private toastService: ToastService,
    ) {}

    static get isLoggedIn() {
        return (
            AuthenticationService.getUser() && AuthenticationService.hasToken()
        );
    }
    static logout(redierctMessage?: string) {
        if (!AuthenticationService.isLoggedIn) {
            return;
        }
        AuthenticationService.deleteAuthToken();
        AuthenticationService.deleteUser();
        AuthenticationService.reload(redierctMessage);
    }

    static hasToken(): boolean {
        return Boolean(oc(AuthenticationService.getAuthToken()).access_token());
    }

    static setAuthToken(token: Token) {
        sessionStorage.setItem('authToken', JSON.stringify(token));
    }

    static getAuthToken(): Token {
        const token: Token = JSON.parse(sessionStorage.getItem('authToken'));
        return token;
    }

    static deleteAuthToken() {
        sessionStorage.removeItem('authToken');
    }

    static getAccessToken(): string | null {
        const token: Token = JSON.parse(sessionStorage.getItem('authToken'));
        return oc(token).access_token(null);
    }

    static updateToken(token: Token) {
        const newToken = merge(AuthenticationService.getAuthToken(), token);
        AuthenticationService.setAuthToken(newToken);
    }

    static setUser(userPayload: User) {
        sessionStorage.setItem('user', JSON.stringify(userPayload));
    }

    static getUser(): User | null {
        const sessionStoredUser = JSON.parse(sessionStorage.getItem('user'));
        if (sessionStoredUser) {
            const userPayload: User = sessionStoredUser;
            return userPayload;
        }

        return null;
    }

    static deleteUser() {
        sessionStorage.removeItem('user');
    }

    static getUserLanguage() {
        return this.getUser() ? this.getUser().language : null;
    }

    static getUserStartOfWeek() {
        return this.getUser() && this.getUser().firstDayOfWeek
            ? this.getUser().firstDayOfWeek
            : 'monday';
    }

    static getUserDateFormat() {
        return this.getUser() && this.getUser().dateFormat
            ? this.getUser().dateFormat
            : 'dd/MM/yyyy';
    }

    static hasCompletedOnboarding() {
        const user = AuthenticationService.getUser();
        return oc(user).hasCompletedOnboarding(false);
    }

    static hasConsented(user: User) {
        return oc(user).onboardingState.hasConsented(false);
    }
    // static hasFullyConsented(user: User) {
    //     return oc(user).onboardingState.hasFullyConsented(false);
    // }

    static hasUpdatedPassword(user: User) {
        return oc(user).onboardingState.hasUpdatedPassword(false);
    }

    static hasUpdatedProfilePicture(user: User) {
        return oc(user).onboardingState.hasUpdatedProfilePicture(false);
    }

    static requiresMfa() {
        return oc(this.getAuthToken()).user.mfa_required(true);
    }

    static passwordExpired() {
        return oc(this.getAuthToken()).user.pw_expired(true);
    }

    // static fullyConsentedValue() {
    //     return oc(this.getAuthToken()).user.fully_consented(false);
    // }
    static reload(redierctMessage?: string) {
        window.location.href = redierctMessage
            ? `?redierctMessage=${redierctMessage}`
            : '';
    }

    static isCareCoordinator() {
        return oc(this.getAuthToken())
            .user.roles([])
            .includes('ROLE_CARE_COORDINATOR');
    }

    static isPatient() {
        return oc(this.getAuthToken())
            .user.roles([])
            .includes('ROLE_PATIENT');
    }

    static getAcceptedLegalDocuments() {
        const user = AuthenticationService.getUser();
        return user.documentsAccepted.sort(
            (docA, docB) =>
                new Date(docB.dateAccepted).valueOf() -
                new Date(docA.dateAccepted).valueOf(),
        );
    }

    static setIsRestrictedRequested() {
        const user = AuthenticationService.getUser();
        user.isRestrictedRequested = true;
        AuthenticationService.setUser(user);
    }

    // static setFullyConsented() {
    //     const token = AuthenticationService.getAuthToken();
    //     token.user.fully_consented = true;
    //     AuthenticationService.setAuthToken(token);
    // }

    login(payload: LoginBody) {
        return this.getOauthToken(payload).pipe(
            mergeMap(() => {
                if (AuthenticationService.passwordExpired()) {
                    const changePasswordModal = this.modalService.create<
                        ChangePasswordComponent
                    >(ChangePasswordComponent);
                    changePasswordModal.open();
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('passwordExpired'),
                        3,
                        10000,
                    );
                    return observableThrowError({
                        status: 403,
                        message: this.localiseService.fromKey(
                            'passwordExpired',
                        ),
                    });
                }
                if (AuthenticationService.requiresMfa()) {
                    return this.mfaCoordinator.start(payload.username);
                }
                return this.getUserProfile();
            }),
        );
    }

    getUserProfile() {
        return this.http.get(`${environment.baseUrl}/user`).pipe(
            tap((res: FindOneResponse<User>) => this.handleGetUserProfile(res)),
            catchError(() =>
                observableThrowError(
                    new Error(this.localiseService.fromKey('noUserFound')),
                ),
            ),
        );
    }

    getOauthToken(payload: LoginBody) {
        payload.grant_type = 'password';
        payload.client_id = AppState.clientId;

        return this.http
            .post(`${environment.baseUrl}/oauth/token`, payload)
            .pipe(
                tap((token: Token) => this.handleLoginSuccess(token)),
                catchError((res: Response) => {
                    if (res.status === 401) {
                        return observableThrowError({
                            status: res.status,
                            message: this.localiseService.fromKey(
                                'loginIncorrect',
                            ),
                        });
                    }

                    if (res.status === 403) {
                        return observableThrowError({
                            status: res.status,
                            message: this.localiseService.fromKey(
                                'accountBlockedFifteenMinutes',
                            ),
                        });
                    }

                    return observableThrowError({
                        status: res.status,
                        message: this.localiseService.fromKey('unknownError'),
                    });
                }),
            );
    }

    verifyPassword(password: string) {
        const payload: LoginBody = {
            grant_type: 'password',
            client_id: AppState.clientId,
            password,
            username: AuthenticationService.getUser().email,
        };
        return this.http.post(`${environment.baseUrl}/oauth/token`, payload);
    }

    private handleLoginSuccess(token: Token) {
        AuthenticationService.setAuthToken(token);
    }

    private handleGetUserProfile(res: FindOneResponse<User>) {
        AuthenticationService.setUser(res.data);
        AuthenticationService.onLoginSuccess.next(res.data);
    }
}

export interface LoginBody {
    username?: string;
    password?: string;
    mfa_code?: string;
    grant_type?: string;
    client_id?: string;
}

export interface Token {
    access_token: string;
    refresh_token: string;
    scope: string;
    expires_in: number;
    user: {
        mfa_required: boolean;
        pw_expired: boolean;
        roles: string[];
        fully_consented?: boolean;
    };
}
