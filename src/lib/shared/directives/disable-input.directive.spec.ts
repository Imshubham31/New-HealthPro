import { DisableControlDirective } from '@lib/shared/directives/disable-input.directive';
import { NgControl, FormControl } from '@angular/forms';

describe('DisableControlDirective', () => {
    class MockControl extends NgControl {
        control = new FormControl();
        viewToModelUpdate(newValue: any): void {
            return newValue;
        }
    }

    it('should disable', () => testDisable(true));
    it('should enable', () => testDisable(false));

    function testDisable(disable: boolean) {
        const control = new MockControl();
        const directive = new DisableControlDirective(control);
        directive.disableControlDirective = disable;
        expect(control.control.disabled).toBe(disable);
    }
});
