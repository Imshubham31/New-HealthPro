import { ProfilePictureService } from '@lib/onboarding/profile-picture/profile-picture.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    EventEmitter,
} from '@angular/core';
import { EditProfilePictureComponent } from './edit-profile-picture.component';

let component: EditProfilePictureComponent;
let fixture: ComponentFixture<EditProfilePictureComponent>;

describe('Edit Profile Picture Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [EditProfilePictureComponent],
            providers: [
                {
                    provide: ModalWrapperComponent,
                    useValue: {
                        openModal: () => {},
                        closeModal: () => {},
                    },
                },
                {
                    provide: ProfilePictureService,
                    useValue: {
                        userChanged: new EventEmitter(),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(EditProfilePictureComponent);
        component = fixture.componentInstance;
        (component as any).modal = {
            openModal: () => {},
            closeModal: () => {},
        };
        fixture.detectChanges();
    });
    it('should open modal', () => {
        const spy = spyOn(component.modal, 'openModal');
        component.open();
        expect(spy).toHaveBeenCalled();
    });
    it('should close modal on profile picture change', () => {
        const spy = spyOn(component.modal, 'closeModal');
        component.pictureChanged();
        expect(spy).toHaveBeenCalled();
    });
});
