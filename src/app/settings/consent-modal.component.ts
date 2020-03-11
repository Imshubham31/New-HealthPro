import { Component, Input, ViewChild } from '@angular/core';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ConsentDocument } from '@lib/onboarding/consent/consent-document.model';

@Component({
    templateUrl: './consent-modal.component.html',
    styleUrls: ['./consent-modal.component.scss'],
})
export class ConsentModalComponent implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() document: ConsentDocument;

    open() {
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
    }
}
