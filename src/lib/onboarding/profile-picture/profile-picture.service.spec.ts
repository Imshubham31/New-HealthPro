import { AvatarService } from '@lib/shared/components/avatars/avatar.service';
import { User } from '@lib/authentication/user.model';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ProfilePictureService } from './profile-picture.service';
import { ProfilePictureRestService } from './profile-picture-rest.service';
import { OnboardingCoordinator } from '../onboarding-coordinator.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';
import SpyObj = jasmine.SpyObj;
import { of } from '../../../../node_modules/rxjs';

describe('Profile Picture Service', () => {
    const mockUser = new User();
    mockUser.onboardingState = {
        hasConsented: true,
        hasUpdatedPassword: true,
        hasUpdatedProfilePicture: false,
    };

    let avatarService: SpyObj<AvatarService>;
    let profilePictureRestService: SpyObj<ProfilePictureRestService>;
    let service: ProfilePictureService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                AuthenticationService,
                ProfilePictureService,
                LocaliseService,
                LANGUAGE_PROVIDERS,
                OnboardingCoordinator,
                {
                    provide: ProfilePictureRestService,
                    useValue: jasmine.createSpyObj(
                        'profilePictureRestService',
                        ['create'],
                    ),
                },
                {
                    provide: AvatarService,
                    useValue: jasmine.createSpyObj('avatarService', [
                        'clearCacheItem',
                    ]),
                },
            ],
        });
        AuthenticationService.setUser(mockUser);
    });

    beforeEach(() => {
        avatarService = TestBed.get(AvatarService);
        profilePictureRestService = TestBed.get(ProfilePictureRestService);
        service = TestBed.get(ProfilePictureService);
    });

    it('should emit userChanged event', () => {
        profilePictureRestService.create.and.returnValue(of({}));
        service.userChanged.subscribe(event => {
            expect(event).toEqual(true);
        });
        service.setProfilePicture('base64text').subscribe();
    });

    it('should update user profile', () => {
        profilePictureRestService.create.and.returnValue(of({}));
        service.setProfilePicture(',base64text').subscribe();
        expect(AuthenticationService.getUser().profilePictureUri).toEqual(
            'base64text',
        );
        expect(avatarService.clearCacheItem).toHaveBeenCalled();
    });

    it('should clear avatar cache for user id', () => {
        profilePictureRestService.create.and.returnValue(of({}));
        service.setProfilePicture(',base64text').subscribe();
        expect(avatarService.clearCacheItem).toHaveBeenCalled();
    });
});
