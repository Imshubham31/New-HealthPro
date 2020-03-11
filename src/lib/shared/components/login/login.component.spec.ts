import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from './../../../authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>; // create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('Login Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule, ReactiveFormsModule],
            declarations: [LoginComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: AuthenticationService,
                    useValue: {
                        login: of(true),
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigate: () => {},
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParams: {
                                redierctMessage: 'test',
                            },
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        (component as any).router = {
            navigate: () => {},
        };
        component.setupForm();
        fixture.detectChanges();
    });
    it('should navigate to forgot password', () => {
        spyOn((component as any).router, 'navigate');
        component.forgotPassword();
        expect((component as any).router.navigate).toHaveBeenCalled();
    });
    it('should get redirect message', () => {
        expect(component.redierctMessage).toBe('test');
        expect(
            (component as any).route.snapshot.queryParams['redierctMessage'],
        ).toBe('test');
    });
    describe('Behaviours', () => {
        it('should disable submit on invalid form', () => {
            component.loginForm.controls['username'].setValue(
                'username@jnj.com',
            );
            component.loginForm.controls['password'].setValue('');
            expect(component.shouldDisableSubmit()).toBeTruthy();
        });
        it('should send login data', () => {
            spyOn(component.authService, 'login').and.returnValue(of());
            expect(component.submitting).toBeFalsy();
            component.loginForm.controls['username'].setValue(
                'username@jnj.com',
            );
            component.loginForm.controls['password'].setValue('Password123');
            expect(component.shouldDisableSubmit()).toBeFalsy();
            component.login();
            expect(component.submitting).toBeFalsy();
        });
        it('should send login data and catch error', () => {
            const newError = {
                code: 500,
                message: 'ups',
                system: 'string',
            };
            spyOn(component.authService, 'login').and.returnValue(
                Observable.throw(newError),
            );
            expect(component.submitting).toBeFalsy();
            component.loginForm.controls['username'].setValue(
                'username@jnj.com',
            );
            component.loginForm.controls['password'].setValue('Password123');
            expect(component.shouldDisableSubmit()).toBeFalsy();
            component.login();
            expect(component.submitting).toBeFalsy();
            expect(component.formError).toBe('ups');
        });
    });
});
