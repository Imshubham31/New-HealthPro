import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaSuccessComponent } from './mfa-success.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('MfaSuccessComponent', () => {
    let component: MfaSuccessComponent;
    let fixture: ComponentFixture<MfaSuccessComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [MfaSuccessComponent],
            providers: [
                {
                    provide: AuthenticationService,
                    useValue: jasmine.createSpyObj('authService', {
                        getUserProfile: of(),
                    }),
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MfaSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should move to add phone', () => {
        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        expect(
            (component as any).authService.getUserProfile,
        ).toHaveBeenCalled();
    });
});
