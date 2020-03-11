import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalControls } from '../modal/modal.service';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements ModalControls {
    @Input() heading;
    @Input() subtitle;
    @Input() confirmBtnText = this.localise.fromKey('yes');
    @Output() onClose = new EventEmitter<boolean>();

    @ViewChild(ModalWrapperComponent, { static: true })
    modal: ModalWrapperComponent;

    constructor(private localise: LocaliseService) {}

    open() {
        this.modal.openModal();
    }

    close(result) {
        this.modal.closeModal();
        this.onClose.next(result);
    }

    handleYes() {
        this.close(true);
    }

    handleNo() {
        this.close(false);
    }
}
