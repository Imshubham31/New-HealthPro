import { AuthenticationService } from './../../authentication/authentication.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { EditUserService } from './edit-user.service';
import { Observable } from 'rxjs/Rx';
import { EditUserComponent } from './edit-user.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@lib/shared/shared.module';
import { HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { Router } from '@angular/router';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';

let component: EditUserComponent;
let fixture: ComponentFixture<EditUserComponent>; // create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('Edit User Component', () => {
    const mockTostService = {
        show: () => {},
    };
    function setValidData() {
        component.form.controls['firstName'].setValue('firstName');
        component.form.controls['lastName'].setValue('lastName');
        component.form.controls['email'].setValue('email@jnj.com');
        component.form.controls['phoneNumber'].setValue('555');
        component.form.controls['gender'].setValue('male');
        component.form.controls['units'].setValue('metric');
        component.form.controls['language'].setValue('en');
    }
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                HttpClientModule,
                CommonModule,
                LocaliseModule,
                ReactiveFormsModule,
            ],
            declarations: [EditUserComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: EditUserService,
                    useValue: {
                        editUserData: of(true),
                    },
                },
                { provide: ToastService, useValue: mockTostService },
                {
                    provide: ModalService,
                    useValue: {
                        create: () => ({
                            newProfilePicture: of(true),
                            open: () => {},
                        }),
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigateByUrl: () => Promise.resolve({}),
                        navigate: () => {},
                    },
                },
                HospitalsRestService,
                HospitalService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditUserComponent);
        component = fixture.componentInstance;
        component.setupForm();
        fixture.detectChanges();
    });

    it('should get user roles', () => {
        expect(component.userRoles[0].value).toBe('surgeon');
    });
    it('should handle user with roles', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            role: 'surgeon',
        });
        component.setupForm();
        expect(component.form.controls['roleRadioSelection'].value).toBe(
            'existing',
        );
        expect(component.setRole()).toBeTruthy();
    });
    it('should handle user with without role', () => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            role: '',
        });
        component.setupForm();
        expect(component.form.controls['roleRadioSelection'].value).toBe(
            'other',
        );
        expect(component.setRole()).toBeFalsy();
    });
    describe('behaviours', () => {
        it('should run setup form on cancel', () => {
            spyOn(component, 'setupForm');
            const input = fixture.debugElement.query(By.css('button.btn-link'))
                .nativeElement;
            input.click();
            expect(component.setupForm).toHaveBeenCalled();
        });
        it('should skip submit on non valid form', () => {
            spyOn(component.editUserService, 'editUserData');
            component.submit();
            expect(
                component.editUserService.editUserData,
            ).not.toHaveBeenCalled();
        });
        it('should submit data if data is valid and handle success', () => {
            spyOn(component.editUserService, 'editUserData').and.returnValue(
                of(true),
            );
            spyOn(component.localiseService, 'fromKey');
            setValidData();
            component.submit();
            expect(component.editUserService.editUserData).toHaveBeenCalled();
            expect(component.localiseService.fromKey).toHaveBeenCalledWith(
                'successEditHcp',
            );
        });
        it('should submit data if data is valid and handle error', () => {
            spyOn(component.editUserService, 'editUserData').and.returnValue(
                Observable.throw(Error()),
            );
            spyOn(component.localiseService, 'fromKey');
            setValidData();
            component.submit();
            expect(component.editUserService.editUserData).toHaveBeenCalled();
            expect(component.localiseService.fromKey).toHaveBeenCalledWith(
                'failEditHcp',
            );
        });
        it('should open modal for change picture when needed', () => {
            spyOn(component, 'changeProfilePicture').and.callThrough();
            const input = fixture.debugElement.query(
                By.css('.change-profile-container>a'),
            ).nativeElement;
            input.click();
            expect(component.changeProfilePicture).toHaveBeenCalled();
        });
    });
});
