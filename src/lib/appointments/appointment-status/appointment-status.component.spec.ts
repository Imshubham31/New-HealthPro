import { AppointmentStatusComponent } from './appointment-status.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UnitsUtils } from '@lib/utils/units-utils';
import { AppointmentStatus } from '../appointment-status.enum';

let component: AppointmentStatusComponent;
let fixture: ComponentFixture<AppointmentStatusComponent>;

describe('Appoitment Status Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [AppointmentStatusComponent],
            providers: [UnitsUtils],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(AppointmentStatusComponent);
        component = fixture.componentInstance;
        component.status = AppointmentStatus.accepted;
        component.text = 'test';
        fixture.detectChanges();
    });
    it('should getStatusIcon', () => {
        expect(component.getStatusIcon()).toBe('fa-check-circle');
    });
});
