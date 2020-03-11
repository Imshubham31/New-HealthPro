import { ModalDateTimePickerComponent } from './date-time-picker.component';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Service } from './service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

let component: ModalDateTimePickerComponent;
let fixture: ComponentFixture<ModalDateTimePickerComponent>;

describe('Modal Datepicker Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, NzDatePickerModule],
            declarations: [ModalDateTimePickerComponent],
            providers: [Service],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(ModalDateTimePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should handleChange', () => {
        const spy = spyOn(component.group, 'get').and.returnValue({
            enable: () => {},
            setValue: () => {},
            disable: () => {},
        });
        component.ngOnChanges({});

        expect(spy).not.toHaveBeenCalled();
        component.ngOnChanges({
            disabled: {
                previousValue: false,
                currentValue: true,
                firstChange: false,
                isFirstChange: () => this.firstChange,
            },
        });
        expect(spy).toHaveBeenCalledWith('time');
    });

    describe('should disable time if date not set', () => {
        const getSpy = jasmine.createSpyObj('get', [
            'enable',
            'setValue',
            'disable',
        ]);
        const chechDisableTimeIfDateNotSet = (
            value,
            enable,
            setValue,
            disable,
        ) => {
            getSpy.enable.calls.reset();
            getSpy.setValue.calls.reset();
            getSpy.disable.calls.reset();
            component.group.value.date = value;
            component.ngOnChanges({
                disabled: {
                    previousValue: false,
                    currentValue: true,
                    firstChange: false,
                    isFirstChange: () => this.firstChange,
                },
            });
            if (enable) {
                expect(getSpy.enable).toHaveBeenCalled();
            } else {
                expect(getSpy.enable).not.toHaveBeenCalled();
            }
            if (setValue) {
                expect(getSpy.setValue).toHaveBeenCalled();
            } else {
                expect(getSpy.setValue).not.toHaveBeenCalled();
            }
            if (disable) {
                expect(getSpy.disable).toHaveBeenCalled();
            } else {
                expect(getSpy.disable).not.toHaveBeenCalled();
            }
        };
        beforeAll(() => {
            spyOn(component.group, 'get').and.returnValue(getSpy);
        });

        it('should enable when date is set', () => {
            component.disabled = false;
            chechDisableTimeIfDateNotSet('date', true, false, false);
        });
        it('should disable when date is not set', () => {
            chechDisableTimeIfDateNotSet(undefined, false, true, true);
        });
        it('should disable when disabled and date set', () => {
            component.disabled = true;
            chechDisableTimeIfDateNotSet('date', false, false, true);
        });
    });
});
