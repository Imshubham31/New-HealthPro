import { ModalService } from './../../modal/modal.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

let component: ForgotPasswordComponent;
let fixture: ComponentFixture<ForgotPasswordComponent>;

describe('Forgot Password Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ForgotPasswordComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParams: {
                                token: 'token',
                            },
                        },
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: key => key,
                        getLocale: () => 'EN',
                        fromParams: () => {},
                    },
                },
                {
                    provide: ModalService,
                    useValue: {
                        create: () => ({
                            open: () => {},
                        }),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should open modal on showPasswordDialog', () => {
        const spy = jasmine.createSpy('openModalSpy');
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => spy(),
        });
        component.showPasswordDialog();
        expect(spy).toHaveBeenCalled();
    });
});
