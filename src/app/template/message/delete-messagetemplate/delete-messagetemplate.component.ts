import { MessageService } from './../../message.service';
import { EventEmitter } from '@angular/core';
import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';

@Component({
    selector: 'app-delete-messagetemplate',
    templateUrl: './delete-messagetemplate.component.html',
    styleUrls: ['./delete-messagetemplate.component.scss'],
})
export class DeleteMessagetemplateComponent implements OnInit, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() tempId: string;
    @Output() onSuccess = new EventEmitter();
    constructor(private messageService: MessageService) {}

    ngOnInit() {}
    open() {
        this.modal.openModal();
    }
    close() {
        this.modal.closeModal();
    }
    deleteappointment() {
        this.messageService.deleteMessageTemplate(this.tempId).subscribe(() => {
            this.onSuccess.next();
            this.close();
        });
    }
}
