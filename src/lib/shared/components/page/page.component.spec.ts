import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PageComponent } from './page.component';

@Component({
    template: `
        <page-container [title]="title">
            <page-action-button></page-action-button>
            <page-popover></page-popover>
            <page-content>
                {{ content }}
            </page-content>
        </page-container>
    `,
})
class TestHostComponent {
    title: string;
    content: string;
}

describe('PageComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let page: PageObject;

    class PageObject {
        get title(): string {
            return fixture.debugElement
                .query(By.css('h1'))
                .nativeElement.textContent.trim();
        }

        get content(): DebugElement {
            return fixture.debugElement.query(By.css('page-content'));
        }

        get actionButton(): DebugElement {
            return fixture.debugElement.query(By.css('page-action-button'));
        }
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [PageComponent, TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        page = new PageObject();
        fixture.detectChanges();
    });

    it('should display the provided title', () => {
        component.title = 'title';
        fixture.detectChanges();

        expect(page.title).toEqual(component.title);
    });

    it('should display the page content', () => {
        component.content = 'test';
        fixture.detectChanges();

        expect(page.content.nativeElement.textContent.trim()).toEqual(
            component.content,
        );
    });
    describe('when the page action button is provided', () => {
        it('should be defined', () => {
            expect(page.actionButton).toBeDefined();
        });
    });
});
