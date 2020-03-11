import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMfaComponent } from './start-mfa.component';
import { By } from '@angular/platform-browser';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { MfaCoordinatorService } from '../mfa-coordinator.service';

describe('StartMfaComponent', () => {
    let component: StartMfaComponent;
    let fixture: ComponentFixture<StartMfaComponent>;
    const coordinatorStub = {
        goToSelectMethod: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StartMfaComponent, MockLocalisePipe],
            providers: [
                {
                    provide: MfaCoordinatorService,
                    useValue: coordinatorStub,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartMfaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should move to next screen', () => {
        const button = fixture.debugElement.query(By.css('button'));
        spyOn((component as any).mfaCoordinator, 'goToSelectMethod');
        button.triggerEventHandler('click', null);
        expect(
            (component as any).mfaCoordinator.goToSelectMethod,
        ).toHaveBeenCalled();
    });
});
