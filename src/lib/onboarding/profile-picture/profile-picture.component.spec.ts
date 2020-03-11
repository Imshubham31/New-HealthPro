import { Observable } from 'rxjs/Rx';
import { ProfilePictureComponent } from './profile-picture.component';
import { ProfilePictureService } from './profile-picture.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

let component: ProfilePictureComponent;
let fixture: ComponentFixture<ProfilePictureComponent>; // create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

const profilePictureServiceStub = {
    setProfilePicture(base64Image: string) {
        return of(false);
    },
    userChanged: of(true),
    user: {},
};

describe('Profile Picture Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule, ReactiveFormsModule],
            declarations: [ProfilePictureComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: ProfilePictureService,
                    useValue: profilePictureServiceStub,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilePictureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.formError = null;
    });

    it('file change event should arrive in handler', () => {
        const input = fixture.debugElement.query(By.css('input[type=file]'))
            .nativeElement;
        spyOn(component, 'onUpload');
        input.dispatchEvent(new Event('change'));
        expect(component.onUpload).toHaveBeenCalled();
    });
    it('should encode image to base 64 on image change ', () => {
        const event = {
            srcElement: {
                files: [new Blob(['YmxvYg=='])],
            },
        };
        const mockFileReader = {
            readAsDataURL: function(blob) {
                this.result = 'blob';
            },
            onload: function() {},
            result: '',
        };
        (window as any).FileReader = mockFileReader;
        spyOn(window as any, 'FileReader').and.returnValue(<any>mockFileReader);
        component.onUpload(event);
        mockFileReader.onload();
        expect(component.base64Image).toBe('blob');
    });
    it('submit should skip request if there is no image', () => {
        spyOn((component as any).profilePictureService, 'setProfilePicture');
        component.submit();
        expect(
            (component as any).profilePictureService.setProfilePicture,
        ).not.toHaveBeenCalled();
    });
    it('submit should make request if there is image', () => {
        component.base64Image = 'test';
        spyOn(
            (component as any).profilePictureService,
            'setProfilePicture',
        ).and.returnValue(of(true));
        spyOn(component.profilePictureSet, 'emit');
        component.submit();
        expect(
            (component as any).profilePictureService.setProfilePicture,
        ).toHaveBeenCalled();
        expect(component.profilePictureSet.emit).toHaveBeenCalled();
        expect(component.formError).toBe(null);
    });
    it('submit should make request if there is image and handle error', () => {
        const newError = {
            code: 500,
            message: 'ups',
            system: 'string',
        };
        component.base64Image = 'test';
        spyOn(
            (component as any).profilePictureService,
            'setProfilePicture',
        ).and.returnValue(Observable.throw(newError));
        spyOn(component.profilePictureSet, 'emit');
        component.submit();
        expect(
            (component as any).profilePictureService.setProfilePicture,
        ).toHaveBeenCalled();
        expect(component.profilePictureSet.emit).toHaveBeenCalled();
        expect(component.formError).toBe('ups');
    });
    it('should skip profile image when needed', () => {
        spyOn(component.notNow, 'emit');
        component.skipProfilePicture();
        expect(component.notNow.emit).toHaveBeenCalled();
    });
    it('should get title from translations', () => {
        spyOn((component as any).localiseService, 'fromKey');
        component.getTitle();
        expect((component as any).localiseService.fromKey).toHaveBeenCalledWith(
            'editProfilePicture',
        );
    });
});
