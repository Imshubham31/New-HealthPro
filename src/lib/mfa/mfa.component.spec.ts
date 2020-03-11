import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxdModule } from '@ngxd/core';
import { MfaComponent } from './mfa.component';
import { StartMfaComponent } from './start-mfa/start-mfa.component';
import { SelectMethodComponent } from './select-method/select-method.component';
import { AddPhoneComponent } from './add-phone/add-phone.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EnterCodeComponent } from './enter-code/enter-code.component';
import { MfaSuccessComponent } from './mfa-success/mfa-success.component';
import { MfaHelpers } from 'test/support/mfa.helpers';
import { MfaCoordinatorService, MfaScreen } from './mfa-coordinator.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MfaService } from '@lib/mfa/mfa.service';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

describe('MfaComponent', () => {
    let component: MfaComponent;
    let fixture: ComponentFixture<MfaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            ...MfaHelpers.emailPhoneTestingConfig,
            imports: [
                ...MfaHelpers.emailPhoneTestingConfig.imports,
                NgxdModule,
            ],
            providers: [
                {
                    provide: MfaCoordinatorService,
                    useValue: jasmine.createSpyObj('mfaCoordinator', ['start']),
                },
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
            declarations: [MfaComponent, StartMfaComponent],
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [StartMfaComponent],
            },
        });
    }));

    beforeEach(() => {
        const coordinatorService: any = TestBed.get(MfaCoordinatorService);
        coordinatorService.state = new BehaviorSubject({});
        coordinatorService.start.and.returnValue(of(null));
        fixture = TestBed.createComponent(MfaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should setComponent', () => {
        component.setComponent(MfaScreen.StartScreen);
        expect((component as any).component.name).toEqual(
            StartMfaComponent.name,
        );
        component.setComponent(MfaScreen.SelectMethod);
        expect((component as any).component.name).toEqual(
            SelectMethodComponent.name,
        );
        component.setComponent(MfaScreen.AddPhone);
        expect((component as any).component.name).toEqual(
            AddPhoneComponent.name,
        );
        component.setComponent(MfaScreen.AddEmail);
        expect((component as any).component.name).toEqual(
            AddEmailComponent.name,
        );
        component.setComponent(MfaScreen.EnterCode);
        expect((component as any).component.name).toEqual(
            EnterCodeComponent.name,
        );
        component.setComponent(MfaScreen.Success);
        expect((component as any).component.name).toEqual(
            MfaSuccessComponent.name,
        );
        component.setComponent('test' as any);
    });
});
