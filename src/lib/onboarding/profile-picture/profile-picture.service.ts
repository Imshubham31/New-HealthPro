import { AvatarService } from './../../shared/components/avatars/avatar.service';
import { tap } from 'rxjs/operators';
import { EventEmitter, Injectable } from '@angular/core';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { ProfilePictureRestService } from './profile-picture-rest.service';

@Injectable()
export class ProfilePictureService {
    user: User;
    userChanged = new EventEmitter(false);

    constructor(
        private profilePictureRestService: ProfilePictureRestService,
        private avatarService: AvatarService,
    ) {
        this.user = AuthenticationService.getUser();
    }

    setProfilePicture(base64Image: string) {
        return this.sendProfilePicture(base64Image.split(',')[1]);
    }

    skipProfilePicture() {
        return this.sendProfilePicture();
    }

    private sendProfilePicture(data = '') {
        return this.profilePictureRestService
            .create({ profile_picture: data })
            .pipe(
                tap(res => {
                    this.user = AuthenticationService.getUser();
                    this.user.onboardingState.hasUpdatedProfilePicture = true;
                    this.user.profilePictureUri = data;
                    this.avatarService.clearCacheItem(this.user.backendId);
                    this.userChanged.emit(true);
                    AuthenticationService.setUser(this.user);
                }),
            );
    }
}
