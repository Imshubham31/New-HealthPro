import { PasswordRequiredDialogComponent } from './password-required-dialog.component';
import { UserPrivacyService } from '../user-privacy.service';
import { AuthenticationModule } from '@lib/authentication/authentication.module';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { FormBuilder } from '@angular/forms';

import { HospitalService } from '@lib/hospitals/hospital.service';
import { HcpService } from '../../hcp/hcp.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { of, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { TestHCPs } from 'test/support/test-hcps';
import { MfaCoordinatorService } from '../../../lib/mfa/mfa-coordinator.service';

let component: PasswordRequiredDialogComponent;
let fixture: ComponentFixture<PasswordRequiredDialogComponent>;
const formBuilder: FormBuilder = new FormBuilder();

describe('Right to be forgotten component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule, AuthenticationModule],
            declarations: [PasswordRequiredDialogComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                {
                    provide: HcpService,
                    useValue: {
                        fetchHcps: () => of(),
                        getHCPs$: () => of([]),
                        store$: of({
                            list: [],
                        }),
                    },
                },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of(),
                        hospital: of({ name: 'test' }),
                    },
                },
                {
                    provide: ModalService,
                    useValue: {
                        openModal: () => {},
                        closeModal: () => {},
                    },
                },
                {
                    provide: MfaCoordinatorService,
                    useValue: {
                        start: () => {},
                    },
                },
                { provide: PaginationService, useValue: {} },
                {
                    provide: UserPrivacyService,
                    useValue: {
                        beForgotten$: () => {},
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        fixture = TestBed.createComponent(PasswordRequiredDialogComponent);
        component = fixture.componentInstance;
        component.setupForm();
        (component as any).modal = {
            openModal: () => {},
            closeModal: () => {},
        };
    });

    afterEach(() => AuthenticationService.deleteUser());

    it('should open and close modal when needed', () => {
        spyOn(component.modal, 'openModal');
        spyOn(component.modal, 'closeModal');
        component.open();
        component.close();
        expect(component.modal.openModal).toHaveBeenCalled();
        expect(component.modal.closeModal).toHaveBeenCalled();
    });
    it('should submit emit onSuccess', done => {
        component.onSuccess.subscribe(() => done());
        spyOn(
            (component as any).authentication,
            'verifyPassword',
        ).and.returnValue(of(true));
        component.submit();
    });
    it('should submit and handle bad password', () => {
        spyOn(
            (component as any).authentication,
            'verifyPassword',
        ).and.returnValue(
            Observable.throwError({
                status: 401,
                error: {
                    code: 0,
                },
            }),
        );
        spyOn((component as any).localiseService, 'fromKey');
        component.submit();
        expect((component as any).localiseService.fromKey).toHaveBeenCalledWith(
            'badPassword',
        );
    });
    it('should submit and handle unknownError', () => {
        spyOn(
            (component as any).authentication,
            'verifyPassword',
        ).and.returnValue(
            Observable.throwError({
                status: 0,
                error: {
                    code: 0,
                },
            }),
        );
        spyOn((component as any).localiseService, 'fromKey');
        component.submit();
        expect((component as any).localiseService.fromKey).toHaveBeenCalledWith(
            'unknownError',
        );
    });
    it('should submit and handle accountBlockedFifteenMinutes', () => {
        spyOn(
            (component as any).authentication,
            'verifyPassword',
        ).and.returnValue(
            Observable.throwError({
                status: 403,
                error: {
                    code: 0,
                },
            }),
        );
        spyOn(AuthenticationService, 'logout');
        component.submit();
        expect(AuthenticationService.logout).toHaveBeenCalledWith(
            'accountBlockedFifteenMinutes',
        );
    });
});
