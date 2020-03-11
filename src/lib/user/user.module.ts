import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocaliseModule } from '@lib/localise/localise.module';
import { OnboardingModule } from '@lib/onboarding/onboarding.module';
import { EditProfilePictureComponent } from './edit-user/edit-profile-picture/edit-profile-picture.component';
import { EditUserRestService } from './edit-user/edit-user-rest.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserService } from './edit-user/edit-user.service';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@lib/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LocaliseModule,
        FormsModule,
        ReactiveFormsModule,
        UserRoutingModule,
        OnboardingModule,
    ],
    declarations: [EditUserComponent, EditProfilePictureComponent],
    providers: [EditUserService, EditUserRestService],
    entryComponents: [EditProfilePictureComponent],
})
export class UserModule {}
