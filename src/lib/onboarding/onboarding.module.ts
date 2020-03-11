import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { ConfirmationModalComponent } from './consent/confirmation-modal/confirmation-modal.component';
import { ConsentRestService } from './consent/consent-rest.service';
import { ConsentComponent } from './consent/consent.component';
import { ConsentService } from './consent/consent.service';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { ProfilePictureService } from './profile-picture/profile-picture.service';
import { ProfilePictureRestService } from './profile-picture/profile-picture-rest.service';
import { SharedModule } from '@lib/shared/shared.module';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { OnboardingCoordinator } from './onboarding-coordinator.service';

@NgModule({
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        LocaliseModule,
    ],
    declarations: [
        OnboardingComponent,
        ProfilePictureComponent,
        ConsentComponent,
        ConfirmationModalComponent,
    ],
    providers: [
        OnboardingCoordinator,
        ConsentService,
        ConsentRestService,
        ProfilePictureService,
        ProfilePictureRestService,
        LocaliseService,
        HospitalsRestService,
    ],
    exports: [ProfilePictureComponent],
    entryComponents: [ConfirmationModalComponent],
})
export class OnboardingModule {}
