import { finalize } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ConsentService } from '../consent.service';
import { ModalControls } from '@lib/shared/components/modal/modal.service';

@Component({
    moduleId: module.id,
    templateUrl: 'confirmation-modal.component.html',
    styleUrls: ['confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    isSubmitting = false;

    constructor(
        private localiseService: LocaliseService,
        private consentService: ConsentService,
    ) {}

    getTitle() {
        return this.localiseService.fromKey('optOutTitle');
    }

    getSubtitle() {
        return this.localiseService.fromKey('optOutSubtitle');
    }

    declineDocuments() {
        this.isSubmitting = true;
        this.consentService
            .declineConsentDocuments()
            .pipe(finalize(() => (this.isSubmitting = false)))
            .subscribe(() => AuthenticationService.logout());
    }

    open() {
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
    }
}
