import { MfaOption, MfaMethod } from './mfa-rest.service';
import { TestBed } from '@angular/core/testing';

import { MfaCoordinatorService, MfaScreen } from './mfa-coordinator.service';
import { MfaService } from './mfa.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('MfaCoordinatorService', () => {
    let coordinator: MfaCoordinatorService;
    let service: any;
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                MfaCoordinatorService,
                {
                    provide: MfaService,
                    useValue: jasmine.createSpyObj('mfaService', [
                        'updateMfaOption',
                        'verifyCode',
                        'getValidatedOption',
                    ]),
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigate']),
                },
            ],
        }),
    );
    beforeEach(() => {
        coordinator = TestBed.get(MfaCoordinatorService);
        service = TestBed.get(MfaService);
    });

    it('should go to registration flow when no mfa option found', () => {
        service.getValidatedOption.and.returnValue(of(null));
        coordinator.start('asd@asd').subscribe(() => {
            expect(service.getValidatedOption).toHaveBeenCalled();
            expect(coordinator.state.value.isRegFlow).toBeTruthy();
            expect(coordinator.state.value.screen).toBe(MfaScreen.StartScreen);
            expect(coordinator.state.value.loginEmail).toBe('asd@asd');
        });
    });

    it('should go to login flow when mfa option found', () => {
        service.getValidatedOption.and.returnValue(
            of({
                mfaMethod: MfaMethod.sms,
                mfaDestination: '19******332',
                validated: true,
            }),
        );
        coordinator.start('asd@asd').subscribe(() => {
            expect(service.getValidatedOption).toHaveBeenCalled();
            expect(coordinator.state.value.isRegFlow).toBeFalsy();
            expect(coordinator.state.value.screen).toBe(MfaScreen.SelectMethod);
        });
    });

    it('should go to select method', () => {
        coordinator.goToSelectMethod();
        expect(coordinator.state.value.screen).toBe(MfaScreen.SelectMethod);
    });

    it('should go to phone', () => {
        coordinator.goToAddPhone();
        expect(coordinator.state.value.screen).toBe(MfaScreen.AddPhone);
    });

    it('should go to email', () => {
        coordinator.goToAddEmail();
        expect(coordinator.state.value.screen).toBe(MfaScreen.AddEmail);
    });

    it('should go to code', () => {
        coordinator.goToEnterCode();
        expect(coordinator.state.value.screen).toBe(MfaScreen.EnterCode);
    });

    it('should go to success', () => {
        coordinator.goToSuccess();
        expect(coordinator.state.value.screen).toBe(MfaScreen.Success);
    });

    it('should update option', () => {
        const option: MfaOption = {
            mfaMethod: MfaMethod.sms,
            mfaDestination: '123',
            mfaPrimary: true,
        };
        coordinator.updateState({ option });
        expect(coordinator.state.value.option).toBe(option);
    });
});
