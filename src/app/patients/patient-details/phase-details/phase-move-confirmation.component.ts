import { mergeMap } from 'rxjs/operators';
import { Component, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { BaseForm } from '@lib/shared/services/base-form';
import { PatientOverview } from '../../view-patient.model';
import { PathWayService } from '@lib/pathway/pathway.service';
import { Pathway } from '@lib/pathway/pathway.model';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { AppCoordinator } from '../../../../lib/app-coordinator/app-coordinator.service';

@Component({
    templateUrl: 'phase-move-confirmation.component.html',
})
export class PhaseMoveConfirmationComponent extends BaseForm
    implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() pathway: Pathway;
    patientToBeMoved: PatientOverview;
    nextPhaseTitle: BehaviorSubject<string>;
    formError: string;
    constructor(
        private fb: FormBuilder,
        private authentication: AuthenticationService,
        private localiseService: LocaliseService,
        private pathWayService: PathWayService,
    ) {
        super();
        this.setupForm();
    }

    open() {
        this.modal.openModal();
    }

    close() {
        this.cleanForm();
        this.modal.closeModal();
    }

    setupForm() {
        this.formError = null;
        this.form = this.fb.group({
            password: ['', [Validators.required]],
        });
    }

    start(patient, nextPhaseName: string) {
        if (this.form) {
            this.form.reset();
            this.formError = null;
        }
        this.nextPhaseTitle = new BehaviorSubject(nextPhaseName);
        this.patientToBeMoved = patient;
        this.open();
    }

    submit() {
        this.submitting = true;
        this.authentication
            .verifyPassword(this.form.get('password').value)
            .pipe(
                mergeMap(() => {
                    AppCoordinator.loadingOverlay.next({ loading: true });
                    return this.pathWayService.moveToNextPhase(this.pathway);
                }),
            )
            .subscribe(
                success => {
                    this.close();
                    AppCoordinator.loadingOverlay.next({ loading: false });
                },
                error => {
                    this.submitting = false;
                    AppCoordinator.loadingOverlay.next({ loading: false });
                    this.formError =
                        error.status === 401
                            ? this.localiseService.fromKey('badPassword')
                            : this.localiseService.fromKey('unknownError');
                    if (error.status === 403) {
                        AuthenticationService.logout();
                    }
                },
            );
    }
}
