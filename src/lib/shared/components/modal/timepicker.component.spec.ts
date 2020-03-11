import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ModalTimepickerComponent } from './timepicker.component';
import { Service } from './service';
import { of } from 'rxjs';

let component: ModalTimepickerComponent;
let fixture: ComponentFixture<ModalTimepickerComponent>;

describe(' Modal Timepicker Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ModalTimepickerComponent],
            providers: [
                {
                    provide: Service,
                    useValue: {
                        onChange: () => {},
                        getValue: () => of(new Date()),
                    },
                },
            ],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ModalTimepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    function getInput() {
        return fixture.nativeElement.querySelector('.form-input');
    }
    function updateInputValue(val) {
        const input = getInput();
        input.value = val;
        input.dispatchEvent(new Event('input'));
    }
    it('should useAM', () => {
        component.isAm = false;
        fixture.nativeElement.querySelectorAll('.btn')[0].click();
        expect(component.isAm).toBeTruthy();
    });
    it('should usePM', () => {
        spyOn((component as any).mask, 'isComplete').and.callFake(() => true);
        updateInputValue('10:11');
        component.usePM();
        expect(component.isAm).toBeFalsy();
    });
    function validateMask(text, isAM, hour, minutes) {
        component.isAm = isAM;
        updateInputValue(text);
        expect(component.value.getHours()).toBe(hour);
        expect(component.value.getMinutes()).toBe(minutes);
    }
    it('convertMaskToDate should work', () => {
        component.ngAfterViewInit();
        validateMask('10:11', true, 10, 11);
        validateMask('10:12', false, 22, 12);
        validateMask('12:13', true, 0, 13);
        validateMask('12:14', false, 12, 14);
    });
    it('should test handleBlur', () => {
        const spy = spyOn(component.service, 'onChange');
        const maskSpy = spyOn((component as any).mask, 'isComplete');
        maskSpy.and.callFake(() => true);
        component.handleBlur();
        expect(spy).not.toHaveBeenCalled();
        maskSpy.and.callFake(() => false);
        component.handleBlur();
        expect(spy).toHaveBeenCalled();
    });
});
