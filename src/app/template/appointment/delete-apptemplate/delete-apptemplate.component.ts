import { AppointmentService } from './../../appointment.service';
import { EventEmitter } from '@angular/core';
import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
@Component({
    selector: 'app-delete-apptemplate',
    templateUrl: './delete-apptemplate.component.html',
    styleUrls: ['./delete-apptemplate.component.scss'],
})
export class DeleteApptemplateComponent implements OnInit, ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Input() tempId: string;
    @Output() onSuccess = new EventEmitter();
    constructor(private appointmentService: AppointmentService) {}

    ngOnInit() {}
    open() {
        this.modal.openModal();
    }
    close() {
        this.modal.closeModal();
    }
    deleteappointment() {
        this.appointmentService
            .deleteAppointmentTemplate(this.tempId)
            .subscribe(() => {
                this.onSuccess.next();
                this.close();
            });
    }
}
