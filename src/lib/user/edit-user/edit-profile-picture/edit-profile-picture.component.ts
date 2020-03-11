import { ProfilePictureService } from '@lib/onboarding/profile-picture/profile-picture.service';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ModalControls } from '@lib/shared/components/modal/modal.service';

@Component({
    templateUrl: 'edit-profile-picture.component.html',
})
export class EditProfilePictureComponent implements ModalControls {
    @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
    @Output() newProfilePicture = new EventEmitter();

    constructor(private profilePictureService: ProfilePictureService) {}

    open() {
        this.modal.openModal();
    }

    close() {
        this.modal.closeModal();
    }

    pictureChanged() {
        this.close();
        this.newProfilePicture.emit();
        this.profilePictureService.userChanged.emit(true);
    }
}
