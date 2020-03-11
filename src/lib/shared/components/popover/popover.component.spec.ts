import { PopoverComponent } from './popover.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PopoverComponent', () => {
    let component: PopoverComponent;
    let fixture: ComponentFixture<PopoverComponent>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [PopoverComponent],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(PopoverComponent);
        component = fixture.componentInstance;
    });

    it('If integrated input is true, name should be displayed', () => {
        component.active = true;
        component.body = 'contact hospital';
        fixture.detectChanges();
        expect(
            fixture.debugElement.nativeElement.querySelector(
                'popover-container',
            ),
        ).toBeDefined();
        expect(fixture.debugElement.nativeElement.innerText).toBe(
            component.body,
        );
    });

    it('If integrated input is false, name should not be shown', () => {
        component.active = false;
        fixture.detectChanges();
        expect(
            fixture.debugElement.nativeElement.querySelector(
                'popover-container',
            ),
        ).toBeNull();
        expect(component.body).toBeUndefined();
    });
});
