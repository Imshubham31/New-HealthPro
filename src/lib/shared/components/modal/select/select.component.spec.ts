import { CommonModule } from '@angular/common';
import { ModalSelectComponent } from './select.component';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Service } from '../service';

import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { of } from 'rxjs';

describe('ModalSelectComponent', () => {
    let component: ModalSelectComponent;
    let fixture: ComponentFixture<ModalSelectComponent>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, Ng2AutoCompleteModule],
            declarations: [ModalSelectComponent],
            providers: [
                {
                    provide: Service,
                    useValue: {
                        getValue: () => of(null),
                        onChange: () => of(null),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalSelectComponent);
        component = fixture.componentInstance;
        component.labelFormatter = val => `-${val}-`;
    });

    it('should select by matched property', fakeAsync(() => {
        const value = { id: 1 };
        component.options = [value, { id: 2 }];
        component.matchProperty = 'id';
        spyOn(component.service, 'getValue').and.returnValue(of(value));
        component.ngOnInit();
        tick();
        expect(component.value).toEqual(value);
    }));

    it('should not select if value is undefined', fakeAsync(() => {
        const value = { id: 1 };
        component.options = [value, { id: 2 }];
        component.matchProperty = 'id';
        spyOn(component.service, 'getValue').and.returnValue(of(undefined));
        component.ngOnInit();
        tick();
        expect(component.value).toEqual(undefined);
    }));

    it('listFormatter should work', () => {
        expect(component.listFormatter('test')).toBe(
            '<a href="#" class="select-option">-test-</a>',
        );
    });
    it('should handle input change', () => {
        spyOn(component.service, 'onChange');
        component.canClear = false;
        component.inputChange(null);
        expect(component.service.onChange).not.toHaveBeenCalled();
        component.canClear = true;
        component.inputChange(null);
        expect(component.service.onChange).toHaveBeenCalled();
    });
    it('should handle value changed', () => {
        const spy = spyOn(component.service, 'onChange');
        component.value = 'oldValue';
        component.handleValueChanged(null);
        expect(spy).toHaveBeenCalledWith(null);
        spy.calls.reset();
        component.value = 'oldValue';
        component.handleValueChanged('newValue');
        expect(spy).toHaveBeenCalledWith('newValue');
        spy.calls.reset();
        component.value = 'oldValue';
        component.handleValueChanged('oldValue');
        expect(spy).not.toHaveBeenCalled();
        component.canClear = true;
        component.value = '';
        component.handleValueChanged('');
        expect(spy).toHaveBeenCalledWith(null);
    });
});
