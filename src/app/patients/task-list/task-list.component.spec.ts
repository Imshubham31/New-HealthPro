import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestPathways } from '../../../test/support/test-pathways';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TaskListComponent } from './task-list.component';
import { SharedModule } from '@lib/shared/shared.module';

describe('TaskListComponent', () => {
    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, LocaliseModule],
            declarations: [TaskListComponent],
        });
    });

    describe('when pathway contains educational content', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(TaskListComponent);
            component = fixture.componentInstance;
            component.pathway = TestPathways.build();
            fixture.detectChanges();
        });

        it('should display all items', () => {
            expect(fixture.debugElement.queryAll(By.css('.item')).length).toBe(
                2,
            );
        });

        it('should display completed items with green tick', () => {
            expect(
                fixture.debugElement.queryAll(
                    By.css('.icon.icon-check.complete'),
                ).length,
            ).toBe(1);
        });

        it('should display incomplete items with normal tick', () => {
            expect(
                fixture.debugElement.queryAll(
                    By.css('.icon.icon-check:not(.complete)'),
                ).length,
            ).toBe(1);
        });
    });

    describe('when pathway does not contain educational content', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(TaskListComponent);
            component = fixture.componentInstance;
            const pathway = TestPathways.build();
            pathway.phases[0].subphases[0].items = [];
            component.pathway = pathway;

            fixture.detectChanges();
        });

        it('no items should appear', () => {
            expect(fixture.debugElement.queryAll(By.css('.item')).length).toBe(
                0,
            );
        });
    });
});
