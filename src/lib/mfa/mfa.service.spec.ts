import { TestBed } from '@angular/core/testing';

import { MfaService } from './mfa.service';
import { MfaRestService } from './mfa-rest.service';
import { of } from 'rxjs';
import { AuthenticationService } from '@lib/authentication/authentication.service';

describe('MfaService', () => {
    let restService: any;
    let service: any;
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                AuthenticationService,
                {
                    provide: MfaRestService,
                    useValue: jasmine.createSpyObj('restService', [
                        'verifyMfa',
                        'postVerificationCode',
                        'getMfaOptions',
                        'postMfaOption',
                        'sendVerificationCode',
                    ]),
                },
                MfaService,
            ],
        }),
    );

    beforeEach(() => {
        service = TestBed.get(MfaService);
        restService = TestBed.get(MfaRestService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should verify code', () => {
        restService.verifyMfa.calls.reset();
        restService.verifyMfa.and.returnValue(of({}));
        service.verifyCode('123');
        expect(restService.verifyMfa).toHaveBeenCalled();
    });

    it('should sendVerificationCode', () => {
        restService.postVerificationCode.calls.reset();
        service.sendVerificationCode('123');
        expect(restService.postVerificationCode).toHaveBeenCalled();
    });

    it('should getValidatedOption', () => {
        restService.getMfaOptions.calls.reset();
        restService.getMfaOptions.and.returnValue(of({}));
        service.getValidatedOption();
        expect(restService.getMfaOptions).toHaveBeenCalled();
    });

    it('should updateMfaOption', () => {
        restService.postMfaOption.calls.reset();
        restService.postMfaOption.and.returnValue(of({} as any));
        service.updateMfaOption();
        expect(restService.postMfaOption).toHaveBeenCalled();
    });

    it('should sendCodeAndGetMethod', () => {
        restService.postVerificationCode.calls.reset();
        restService.postVerificationCode.and.returnValue(of({}));
        service.sendCodeAndGetMethod('asd');
        expect(restService.postVerificationCode).toHaveBeenCalledWith('asd');
    });

    it('should getMfaOption', () => {
        restService.getMfaOptions.calls.reset();
        restService.getMfaOptions.and.returnValue(of({}));
        service.getMfaOption('asd');
        expect(restService.getMfaOptions).toHaveBeenCalled();
    });
});
