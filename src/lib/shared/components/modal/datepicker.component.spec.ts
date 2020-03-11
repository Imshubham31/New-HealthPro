import { NzDatePickerModule } from 'ng-zorro-antd';
import { ModalDatepickerComponent } from './datepicker.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Service } from './service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

let component: ModalDatepickerComponent;
let fixture: ComponentFixture<ModalDatepickerComponent>;

describe('Modal Datepicker Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, NzDatePickerModule],
            declarations: [ModalDatepickerComponent],
            providers: [Service],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(ModalDatepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should handleChange', () => {
        const service = TestBed.get(Service);
        const spy = spyOn(service, 'onChange');
        component.handleDateChanged('date' as any);
        expect(spy).toHaveBeenCalledWith('date');
    });
    it('should handle min dates', () => {
        const date = new Date();
        const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
        component.min = date;
        expect(component.disabledDates(pastDate)).toEqual(true);
    });
    it('should handle max dates', () => {
        const date = new Date();
        const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        component.max = date;
        expect(component.disabledDates(futureDate)).toEqual(true);
    });
});
