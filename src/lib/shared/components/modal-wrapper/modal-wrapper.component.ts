import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';

@Component({
    selector: '[modal-wrapper]',
    styleUrls: ['modal-wrapper.component.scss'],
    templateUrl: './modal-wrapper.component.html',
})
export class ModalWrapperComponent {
    @Input() modalTitle: string;

    @Input() modalSubTitle: string;

    @Input() modalActive;

    @Input() modalWidth = '520px';

    @Input() modalBodyMaxHeight: string;

    @Input() contentOverflow?: string;

    @Input() showCloseBtn = true;

    @ContentChild(TemplateRef, { static: true }) modalFooter: TemplateRef<any>;

    @Output() onCloseModal = new EventEmitter();

    @Output() onOpenModal = new EventEmitter();

    callDestroy: () => void;

    closeModal() {
        this.onCloseModal.emit();
        this.modalActive = false;
        if (this.callDestroy) {
            this.callDestroy();
        }
    }

    openModal() {
        this.onOpenModal.emit();
        this.modalActive = true;
    }
}
