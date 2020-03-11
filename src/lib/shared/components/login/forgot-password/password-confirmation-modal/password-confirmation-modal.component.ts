import { Component, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalWrapperComponent } from '../../../modal-wrapper/modal-wrapper.component';
import { ModalControls } from '../../../modal/modal.service';

@Component({
    moduleId: module.id,
    templateUrl: 'password-confirmation-modal.component.html',
})
export class PasswordConfirmationModalComponent implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() title: string;
    @Input() subtitle: string;
    isSubmitting: boolean;

    constructor(private router: Router) {
        this.isSubmitting = false;
    }

    open() {
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
        this.router.navigate(['/login']);
    }
}
