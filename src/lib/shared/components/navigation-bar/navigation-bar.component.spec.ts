import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { TestHCPs } from 'test/support/test-hcps';
import { AppState } from './../../../../app.state';
import { NavigationBarComponent } from './navigation-bar.component';
import { PageObject } from 'test/support/page-object';

import {
    Component,
    Input,
    EventEmitter,
} from '../../../../../node_modules/@angular/core';
import { ProfilePictureService } from '@lib/onboarding/profile-picture/profile-picture.service';
import { EditUserService } from '@lib/user/edit-user/edit-user.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { RouterTestingModule } from '../../../../../node_modules/@angular/router/testing';
import { AddPatientComponent } from 'app/patients/add-patient/add-patient.component';
import { User } from '@lib/authentication/user.model';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { Subject, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';

@Component({
    selector: 'avatar-img',
    template: '<p>mock</p>',
})
class MockMockAvatarImgComponent {
    @Input() user;
    refresh() {}
}
describe('NavigiationBarComponent', () => {
    class NavigationBarComponentPage extends PageObject<
        NavigationBarComponent
    > {}
    let page: NavigationBarComponentPage;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: ProfilePictureService,
                    useValue: {
                        userChanged: new EventEmitter(false),
                    },
                },
                {
                    provide: EditUserService,
                    useValue: {
                        userData: new Subject<User>(),
                    },
                },
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: key => key,
                    },
                },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of(),
                        hospital: new Subject(),
                    },
                },
            ],
            declarations: [
                NavigationBarComponent,
                MockLocalisePipe,
                MockMockAvatarImgComponent,
            ],
        });
    });
    beforeEach(() => {
        page = new NavigationBarComponentPage(
            TestBed.createComponent(NavigationBarComponent),
        );
    });

    describe('unit', () => {
        it('should get app name', () => {
            AppState.name = 'test';
            expect(page.component.appName).toBe('test');
        });

        describe('ngOnit', () => {
            beforeEach(() => page.component.ngOnInit());
            afterEach(() => AuthenticationService.deleteUser());
            it('should subscribe to ProfilePictureService.userChanged', () => {
                const profileService = TestBed.get(ProfilePictureService);
                const user = TestHCPs.createDrCollins();
                user.firstName = `${Date.now()}`;
                AuthenticationService.setUser(user);
                const avatarRefreshSpy = spyOn(
                    page.component.avatar,
                    'refresh',
                );
                profileService.userChanged.next(true);
                expect(page.component.user.firstName).toEqual(user.firstName);
                expect(avatarRefreshSpy).toHaveBeenCalledTimes(1);
            });
            it('should subscribe to EditUserService.userData', () => {
                const editUserService = TestBed.get(EditUserService);
                const user = TestHCPs.createDrCollins();
                user.firstName = `${Date.now()}`;
                AuthenticationService.setUser(user);
                const avatarRefreshSpy = spyOn(
                    page.component.avatar,
                    'refresh',
                );
                editUserService.userData.next(true);
                expect(page.component.user.firstName).toEqual(user.firstName);
                expect(avatarRefreshSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('isCareCoordinator', () => {
            it('should return true is care coordinator', () => {
                AuthenticationService.setAuthToken({
                    access_token: '',
                    refresh_token: '',
                    scope: '',
                    expires_in: 1,
                    user: {
                        mfa_required: false,
                        pw_expired: false,
                        roles: ['ROLE_CARE_COORDINATOR'],
                        fully_consented: false,
                    },
                });
                expect(page.component.isCareCoordinator()).toBe(true);
                AuthenticationService.deleteAuthToken();
            });
            it('should return false if HCP', () => {
                AuthenticationService.setAuthToken({
                    access_token: '',
                    refresh_token: '',
                    scope: '',
                    expires_in: 1,
                    user: {
                        mfa_required: false,
                        pw_expired: false,
                        roles: ['ROLE_HCP'],
                        fully_consented: false,
                    },
                });
                expect(page.component.isCareCoordinator()).toBe(false);
                AuthenticationService.deleteAuthToken();
            });
        });

        describe('logout', () => {
            it('should call logout', () => {
                const spy = spyOn(AuthenticationService, 'logout');
                spy.and.callFake(() => {});
                page.component.logout();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('addingPatientEvent', () => {
            it('should open AddPatientComponent', done => {
                const modalService = TestBed.get(ModalService);
                modalService.create.and.callFake(() => {
                    return {
                        open: done,
                    };
                });
                page.component.addingPatientEvent();
                expect(modalService.create).toHaveBeenCalledWith(
                    AddPatientComponent,
                );
            });
        });
    });
});
