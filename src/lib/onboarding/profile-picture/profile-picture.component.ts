import { finalize, catchError } from 'rxjs/operators';
import { Component, Output } from '@angular/core';
import { User } from '@lib/authentication/user.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { BaseForm } from '@lib/shared/services/base-form';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfilePictureService } from './profile-picture.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { EventEmitter } from '@angular/core/';

@Component({
    moduleId: module.id,
    selector: 'profile-picture',
    templateUrl: 'profile-picture.component.html',
    styles: [
        `
            .hidden {
                visibility: hidden;
            }
        `,
    ],
})
export class ProfilePictureComponent extends BaseForm {
    @Output() profilePictureSet = new EventEmitter();
    @Output() notNow = new EventEmitter();
    user: User;
    base64Image: string;
    formError: string;

    constructor(
        private profilePictureService: ProfilePictureService,
        private localiseService: LocaliseService,
    ) {
        super();
        this.user = AuthenticationService.getUser();
        profilePictureService.userChanged.subscribe(change => {
            if (change) {
                this.user = AuthenticationService.getUser();
            }
        });
        this.setupForm();
    }

    getTitle(): string {
        return this.localiseService.fromKey('editProfilePicture');
    }

    setupForm() {
        this.form = new FormGroup({
            picture: new FormControl(),
        });
    }

    onUpload(event) {
        this.getBase64(event.srcElement.files[0]);
    }

    shouldDisableSubmit() {
        return this.submitting || !this.base64Image;
    }

    skipProfilePicture() {
        this.notNow.emit();
    }

    submit() {
        if (!this.base64Image) {
            return;
        }
        this.submitting = true;
        this.profilePictureService
            .setProfilePicture(this.base64Image)
            .pipe(
                catchError(error => (this.formError = error.message)),
                finalize(() => {
                    this.submitting = false;
                    this.profilePictureSet.emit();
                }),
            )
            .subscribe(() => (this.submitting = false));
    }

    getBase64(file: File) {
        const _self = this;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            _self.base64Image = reader.result as string;
        };
    }
}
