import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PageActionButtonComponent } from './action-button.component';

describe('PageActionButtonComponent', () => {
    let component: PageActionButtonComponent;
    let fixture: ComponentFixture<PageActionButtonComponent>;

    let button: DebugElement;
    let onClickSpy;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [PageActionButtonComponent],
        });
    });

    beforeEach(() => {
        onClickSpy = jasmine.createSpy('onClickSpy');

        fixture = TestBed.createComponent(PageActionButtonComponent);
        component = fixture.componentInstance;
        component.onClick.subscribe(onClickSpy);
        fixture.detectChanges();

        button = fixture.debugElement.query(By.css('button'));
    });

    it('should contain the action button', () => {
        expect(button.nativeElement).toBeTruthy();
    });

    describe('action button', () => {
        it('should contain the provided text', () => {
            component.text = 'Lorem';
            fixture.detectChanges();

            expect(button.nativeElement.textContent.trim()).toEqual(
                component.text,
            );
        });

        it('should show the icon when provided', () => {
            component.icon = 'plus';
            fixture.detectChanges();

            const icon = button.query(By.css('i'));
            expect(icon.nativeElement.className).toEqual('fa fa-plus');
        });

        it('should have the primary class by default', () => {
            expect(button.nativeElement.className).toContain('btn-primary');
        });

        it('should have the custom class when provided', () => {
            component.class = 'secondary';
            fixture.detectChanges();

            expect(button.nativeElement.className).toContain('btn-secondary');
        });
    });

    describe('when the action button is clicked', () => {
        it('should call the onClick callback', () => {
            button.triggerEventHandler('click', null);

            expect(onClickSpy).toHaveBeenCalled();
        });
    });
});
