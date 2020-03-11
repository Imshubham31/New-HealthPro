import { TestHCPs } from './../../test/support/test-hcps';
import { AuthenticationService } from './../../lib/authentication/authentication.service';
import { HospitalModule } from '@lib/hospitals/hospital.module';
import { UserPrivacyService } from './user-privacy.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsPageComponent } from './settings-page.component';
import { of, Observable } from 'rxjs';
import { ConsentModalComponent } from './consent-modal.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { FormsModule } from '@angular/forms';
import { UserRestService } from '@lib/authentication/user-rest.service';
import { ConsentService } from '@lib/onboarding/consent/consent.service';
import { ConsentRestService } from '@lib/onboarding/consent/consent-rest.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SharedModule } from '@lib/shared/shared.module';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { LegalDocumentRowComponent } from '@lib/settings/legal-document-row.component';
import { EventEmitter } from '@angular/core';
import SpyObj = jasmine.SpyObj;
import { ErrorPipe } from '@lib/shared/services/error.pipe';

describe('Settings Component', () => {
    let component: SettingsPageComponent;
    let userPrivacyService: SpyObj<UserPrivacyService>;
    let toastService: SpyObj<ToastService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                LocaliseModule,
                SharedModule,
                FormsModule,
                RouterTestingModule,
                HospitalModule,
            ],
            declarations: [
                SettingsPageComponent,
                ConsentModalComponent,
                LegalDocumentRowComponent,
            ],
            providers: [
                UserRestService,
                LocaliseService,
                ConsentService,
                ConsentRestService,
                HospitalsRestService,
                ToastService,
                HttpClientTestingModule,
                HttpClient,
                HttpHandler,
                SettingsPageComponent,
                {
                    provide: UserPrivacyService,
                    useValue: jasmine.createSpyObj('userPrivacyService', [
                        'exportData$',
                    ]),
                },
                HospitalService,
                {
                    provide: ToastService,
                    useValue: jasmine.createSpyObj('toastService', ['show']),
                },
                {
                    provide: ErrorPipe,
                    useValue: {
                        transform: err => err,
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        component = TestBed.get(SettingsPageComponent);
        userPrivacyService = TestBed.get(UserPrivacyService);
        toastService = TestBed.get(ToastService);
        AuthenticationService.setUser(TestHCPs.createDrCollins());
    });

    afterEach(() => AuthenticationService.deleteUser());

    it('Should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should return success if hcp can export data', () => {
        userPrivacyService.exportData$.and.returnValue(of({}));
        component.handleCloseConfirmation(true);
        expect(userPrivacyService.exportData$).toHaveBeenCalled();
        expect(component.exportSubmitting).toBe(false);
        userPrivacyService.exportData$.calls.reset();
    });

    it('should return error if hcp cannot export data', () => {
        const localiseService = TestBed.get(LocaliseService);
        userPrivacyService.exportData$.and.returnValue(
            Observable.create(observer => observer.error({})),
        );
        component.handleCloseConfirmation(true);
        expect(userPrivacyService.exportData$).toHaveBeenCalled();
        expect(component.exportSubmitting).toBe(false);
        expect(toastService.show).toHaveBeenCalledWith(
            null,
            localiseService.fromKey('exportDataFail'),
            4,
        );
        userPrivacyService.exportData$.calls.reset();
    });

    it('should init with consent service', () => {
        spyOn(
            (component as any).consentService,
            'getLegalDocs$',
        ).and.returnValue(of('test'));
        component.ngOnInit();
        expect(component.acceptedDocuments as any).toBe('test');
    });

    it('should init with consent service', () => {
        spyOn(
            (component as any).consentService,
            'getLegalDocs$',
        ).and.returnValue(Observable.throw({}));
        spyOn((component as any).localiseService, 'fromKey');
        component.ngOnInit();
        expect((component as any).localiseService.fromKey).toHaveBeenCalledWith(
            'errorFetchingLegalDocuments',
        );
    });

    xit('should open support page when clicked', () => {
        spyOn(window, 'open');
        component.support();
        expect(window.open).toHaveBeenCalledWith('/support?language=en');
    });

    it('should open forgot user modal', () => {
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => {},
            onClose: of(),
            onSuccess: new EventEmitter(),
        });
        component.showBeForgottenModal();
        expect((component as any).modalService.create).toHaveBeenCalled();
    });
    it('should open right to restrict processing modal', () => {
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => {},
            onClose: of(),
            onSuccess: new EventEmitter(),
        });
        component.showRightToBeRestrcitedModal();
        expect((component as any).modalService.create).toHaveBeenCalled();
    });

    it('should not open right to restrict processing modal if restricted', () => {
        AuthenticationService.setIsRestrictedRequested();
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => {},
            onClose: of(),
            onSuccess: new EventEmitter(),
        });
        component.showRightToBeRestrcitedModal();
        expect((component as any).modalService.create).not.toHaveBeenCalled();
        expect(toastService.show).toHaveBeenCalled();
    });

    it('should open change password modal', () => {
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => {},
            onClose: of(),
        });
        component.showChangePasswordModal();
        expect((component as any).modalService.create).toHaveBeenCalled();
    });
});
