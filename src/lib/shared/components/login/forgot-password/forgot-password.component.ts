import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocaliseService } from '@lib/localise/localise.service';
import { PasswordComponentState } from '../../reset-password/password.component';
import { ResetPasswordState } from './request-email/request-password-state';
import { ModalService } from '../../modal/modal.service';
import { PasswordConfirmationModalComponent } from './password-confirmation-modal/password-confirmation-modal.component';

@Component({
    moduleId: module.id,
    templateUrl: 'forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
    token: string;
    passwordComponentState: PasswordComponentState;

    constructor(
        private activatedRoute: ActivatedRoute,
        private localiseService: LocaliseService,
        private modalService: ModalService,
    ) {}

    ngOnInit() {
        const routeSnapshot = this.activatedRoute.snapshot;
        this.token = routeSnapshot.queryParams.token;
        this.passwordComponentState = new ResetPasswordState(this.token);
    }

    showPasswordDialog() {
        this.modalService
            .create<PasswordConfirmationModalComponent>(
                PasswordConfirmationModalComponent,
                {
                    title: this.localiseService.fromKey('passwordUpdated'),
                    subtitle: this.localiseService.fromKey(
                        'yourPasswordHasBeenReset',
                    ),
                },
            )
            .open();
    }
}
