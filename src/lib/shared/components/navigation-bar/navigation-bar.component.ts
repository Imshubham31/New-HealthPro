import { merge as observableMerge } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

import { User } from '@lib/authentication/user.model';
import { ProfilePictureService } from '@lib/onboarding/profile-picture/profile-picture.service';
import { AddPatientComponent } from '../../../../app/patients/add-patient/add-patient.component';
import { EditUserService } from '@lib/user/edit-user/edit-user.service';
import { ModalService } from '../modal/modal.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { AppState } from '../../../../app.state';
import { AvatarImgComponent } from '@lib/shared/components/avatars/avatar-img.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { GenerateRegistrationCodeComponent } from 'app/registration/generate-registration-code/generate-registration-code.component';

@Component({
    moduleId: module.id,
    selector: 'navigation-bar',
    templateUrl: 'navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
    @ViewChild('avatar', { static: true }) avatar: AvatarImgComponent;
    user: User = AuthenticationService.getUser();

    get appName() {
        return AppState.name;
    }

    constructor(
        private profileService: ProfilePictureService,
        private editUserService: EditUserService,
        private modalService: ModalService,
        public localise: LocaliseService,
        public hospitalService: HospitalService,
    ) {}

    ngOnInit() {
        observableMerge(
            this.profileService.userChanged,
            this.editUserService.userData,
            this.hospitalService.fetchHospital(),
        ).subscribe(() => {
            this.user = AuthenticationService.getUser();
            this.avatar.refresh();
        });
    }

    isCareCoordinator() {
        return AuthenticationService.isCareCoordinator();
    }

    logout() {
        AuthenticationService.logout();
    }

    addingPatientEvent() {
        this.modalService
            .create<AddPatientComponent>(AddPatientComponent)
            .open();
    }
    generateRegistrationCodeEvent() {
        const timedCodeGenerationModel = this.modalService
            .create<GenerateRegistrationCodeComponent>(GenerateRegistrationCodeComponent);
            timedCodeGenerationModel.open();
    }
}
