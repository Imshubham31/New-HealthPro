import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { finalize } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UserPrivacyService } from './user-privacy.service';
import { Subscription } from 'rxjs';
import {
    ConsentService,
    AcceptedLegalDocumnets,
} from '@lib/onboarding/consent/consent.service';
import { LocaliseService } from '@lib/localise/localise.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';
import { ConfirmationDialogComponent } from '@lib/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GDPR_CONSTANTS } from '@lib/hospitals/hospital-gdpr.directive';
import { RightToRestrictModalComponent } from './right-to-restrict-modal/right-to-restrict-modal.component';
import { PasswordRequiredDialogComponent } from './password-required-dialog/password-required-dialog.component';
import { HospitalService } from '@lib/hospitals/hospital.service';

@Component({
    selector: 'settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
    newPassword: string;
    error: string;
    exportSubmitting = false;
    subscriptions: Subscription[] = [];
    documents: ConsentDocument[];
    private changePasswordModal: ChangePasswordComponent;
    gdprConstants = GDPR_CONSTANTS;

    acceptedDocuments: AcceptedLegalDocumnets[];
    fetchingDocuments = true;
    fetchingDocumentsError: string;
    disableButton = false;
    forgottenText: string;

    constructor(
        private consentService: ConsentService,
        private localiseService: LocaliseService,
        private toastService: ToastService,
        private userPrivacyService: UserPrivacyService,
        private modalService: ModalService,
        private errorPipe: ErrorPipe,
        private hospitalService: HospitalService,
    ) {}

    ngOnInit() {
        this.consentService.getLegalDocs$().subscribe(
            docs => {
                this.fetchingDocumentsError = undefined;
                this.acceptedDocuments = docs;
            },
            err => {
                this.fetchingDocumentsError = this.localiseService.fromKey(
                    'errorFetchingLegalDocuments',
                );
            },
            () => (this.fetchingDocuments = false),
        );

        this.hospitalService.hospital.subscribe(hospital => {
            this.forgottenText = hospital.integrated
                ? this.localiseService.fromKey('rightToBeForgottenInfo')
                : this.localiseService.fromKey(
                      'rightToBeForgottenInfoNonIntegrated',
                  );
        });
    }

    support() {
        window.open(
            `${
                environment.baseUrl
            }/support?language=${AuthenticationService.getUserLanguage() ||
                'en'}`,
        );
    }

    displayExportModal() {
        const comp = this.modalService.create<ConfirmationDialogComponent>(
            ConfirmationDialogComponent,
            {
                heading: this.localiseService.fromKey('exportData'),
                subtitle: this.localiseService.fromKey('dataFormat'),
                confirmBtnText: this.localiseService.fromKey('export'),
            },
        );
        comp.onClose.subscribe(res => this.handleCloseConfirmation(res));
        comp.open();
    }

    handleCloseConfirmation(result: boolean) {
        if (result) {
            this.exportData();
        }
    }

    showChangePasswordModal() {
        this.changePasswordModal = this.modalService.create<
            ChangePasswordComponent
        >(ChangePasswordComponent);
        this.changePasswordModal.open();
    }

    showBeForgottenModal() {
        const modal = this.modalService.create<PasswordRequiredDialogComponent>(
            PasswordRequiredDialogComponent,
            {
                title: this.localiseService.fromKey('rightToBeForgottenTitle'),
                subtitle: this.forgottenText,
            },
        );
        modal.open();
        modal.onSuccess.subscribe(() => {
            this.userPrivacyService.beForgotten$().subscribe(
                () => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey(
                            'rightToBeForgottenSuccess',
                        ),
                        ToastStyles.Success,
                    );
                },
                error => {
                    this.toastService.show(
                        this.errorPipe.transform(error.error),
                        undefined,
                        ToastStyles.Error,
                    );
                },
            );
        });
    }

    showRightToBeRestrcitedModal() {
        if (AuthenticationService.getUser().isRestrictedRequested) {
            this.toastService.show(
                this.errorPipe.transform({
                    code: 1025,
                    message: undefined,
                    system: undefined,
                }),
                undefined,
                ToastStyles.Error,
            );
            return;
        }
        this.modalService
            .create<RightToRestrictModalComponent>(
                RightToRestrictModalComponent,
            )
            .open();
    }

    private exportData() {
        this.exportSubmitting = true;
        this.userPrivacyService
            .exportData$()
            .pipe(finalize(() => (this.exportSubmitting = false)))
            .subscribe(
                success => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('exportDataSuccess'),
                        ToastStyles.Success,
                    );
                },
                error =>
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('exportDataFail'),
                        ToastStyles.Error,
                    ),
            );
    }
}
