import { TestHCPs } from './../../../../test/support/test-hcps';
import { AvatarService } from '@lib/shared/components/avatars/avatar.service';
import { HttpClientModule } from '@angular/common/http';
import { AvatarImgComponent } from './avatar-img.component';
import { of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import SpyObj = jasmine.SpyObj;
let component: AvatarImgComponent;
let fixture: ComponentFixture<AvatarImgComponent>; // create new instance of FormBuilder
let service: SpyObj<AvatarService>;
describe('Avatar img component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, HttpClientModule],
            declarations: [AvatarImgComponent],
            providers: [
                {
                    provide: AvatarService,
                    useValue: jasmine.createSpyObj('avatarService', [
                        'getAvatar',
                    ]),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AvatarImgComponent);
        service = TestBed.get(AvatarService);
        component = fixture.componentInstance;
        component.user = TestHCPs.createDrCollins();
        fixture.detectChanges();
    });

    it('shoud handle changes', () => {
        const fetchImageSpy = spyOn(component as any, 'fetchImage');
        const oldUser = TestHCPs.createDrCollins();
        const newUser = TestHCPs.build({ id: 'new' });
        component.ngOnChanges({
            user: new SimpleChange(oldUser, newUser, true),
        });
        expect((component as any).fetchImage).toHaveBeenCalledWith(
            newUser.backendId,
        );
        fetchImageSpy.calls.reset();
        component.ngOnChanges({
            user: new SimpleChange(null, null, true),
        });
        component.ngOnChanges({
            user: new SimpleChange(oldUser, oldUser, false),
        });
        component.ngOnChanges({
            user: new SimpleChange(undefined, oldUser, false),
        });

        expect((component as any).fetchImage).not.toHaveBeenCalled();
    });

    it('should refresh', () => {
        spyOn(component as any, 'fetchImage');
        component.refresh();
        expect((component as any).fetchImage).toHaveBeenCalled();
    });

    it('should not refresh if user is not set', () => {
        component.user = undefined;
        spyOn(component as any, 'fetchImage');
        component.refresh();
        expect((component as any).fetchImage).not.toHaveBeenCalled();
    });

    it('should remove subscription on destroy', () => {
        (component as any).subscription = {
            unsubscribe: () => {},
        };
        spyOn(component.subscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should not fetch image if user is restricted', () => {
        component.user.isRestricted = true;
        (component as any).fetchImage();
        expect(service.getAvatar).not.toHaveBeenCalled();
    });

    it('should get image', () => {
        const url = URL.createObjectURL(new Blob());
        service.getAvatar.and.returnValue(of(url));
        (component as any).fetchImage('id');
        expect(component.profile).toEqual(url);
        expect(service.getAvatar).toHaveBeenCalledWith('id', false);
    });

    it('should get image and try bust cache', () => {
        const url = URL.createObjectURL(new Blob());
        service.getAvatar.and.returnValue(of(url));
        (component as any).fetchImage('id', true);
        expect(service.getAvatar).toHaveBeenCalledWith('id', true);
    });
});
