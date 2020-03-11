import { finalize, catchError } from 'rxjs/operators';
import { Component } from '@angular/core';
import { UserConsent } from '@lib/authentication/user.model';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { FormGroup } from '@angular/forms';
import { ConsentService } from './consent.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';
// import { AuthenticationService } from '../../authentication/authentication.service';
// import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'initial-consent',
    templateUrl: 'consent.component.html',
    styleUrls: ['../onboarding.component.scss'],
})
export class ConsentComponent extends BaseForm implements SetsUpForm {
    documents: ConsentDocument[];
    consents: UserConsent[];
    formError: string;
    index: number;

    constructor(
        private consentService: ConsentService,
        private modalService: ModalService,
        // private authservice: AuthenticationService,
        // private router: Router
    ) {
        super();
        this.setupForm();
        this.loadDocuments();
        this.consents = [];
        this.index = 0;
    }

    setupForm() {
        this.form = new FormGroup({});
        this.form.markAsDirty();
    }

    loadDocuments() {
        this.consentService.getConsentDocs().subscribe(next => {
                this.documents = next;
        });
        // const useronboardCheck = AuthenticationService.getUser().hasCompletedOnboarding;
        // if (useronboardCheck === false) {
        //     this.consentService.getConsentDocs().subscribe(next => {
        //         this.documents = next;
        //     });
        // } else {
        //     this.consentService.getuserConsentDocs().subscribe(next => {
        //         const doc = next;
        //         const mapValues = Object.keys(doc).map(i => doc[i]);
        //         this.documents = mapValues.filter(c => {
        //             return c.consented === false;
        //         });
        //     });
        // }

    }

    submit() {
        this.addUserConsent();
        if (this.consents.length < this.documents.length) {
            return;
        }
        this.submitting = true;
        this.consentService
            .submitConsentDocuments(this.consents)
            .pipe(
                catchError(error => (this.formError = error.message)),
                finalize(() => (this.submitting = false)),
            )
            .subscribe(() => (this.submitting = false));
            // subscribe(() => {
            //     this.submitting = false;
            //     if ((AuthenticationService.fullyConsentedValue() === false)
            // && (AuthenticationService.hasCompletedOnboarding() === true)) {
            //         AuthenticationService.setFullyConsented();
            //         this.finishOnboardingUser();
            //     }
            // });

    }

    addUserConsent() {
        const newConsent: UserConsent = {
            key: this.documents[this.index].key,
            revision: this.documents[this.index].version,
            dateAccepted: new Date().toISOString(),
            documentId: this.documents[this.index].documentId,
        };
        this.consents.push(newConsent);
        this.index = Math.min(this.documents.length - 1, this.index + 1);
    }

    currentPosition(): string {
        return `(${this.index + 1}/${this.documents.length})`;
    }

    openConfirm() {
        this.modalService
            .create<ConfirmationModalComponent>(ConfirmationModalComponent)
            .open();
    }
    // finishOnboardingUser() {
    //     this.authservice.getUserProfile().subscribe(() => {
    //         if (AuthenticationService.isCareCoordinator()) {
    //             this.router.navigate(['/patients']);
    //         } else {
    //             this.router.navigate(['/patients-overview']);
    //         }
    //     });
    // }
}
