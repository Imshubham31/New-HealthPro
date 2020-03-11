import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import SpyObj = jasmine.SpyObj;

import { GoalDetailsComponent } from './goal-details.component';
import { TestGoals } from '../../../test/support/test-goals';
import { TestPatients } from '../../../test/support/test-patients';
import { PatientOverview } from '../../patients/view-patient.model';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { TestPathways } from '../../../test/support/test-pathways';
import { GoalService } from '@lib/goals/goal.service';
import { Goal } from '@lib/goals/goal.model';
import { ComponentsFactory } from '@lib/shared/services/components.factory';

describe('StepsComponent', () => {
    let component: GoalDetailsComponent;
    let fixture: ComponentFixture<GoalDetailsComponent>;
    let service: SpyObj<GoalService>;
    let factory: ComponentsFactory;

    const patient = TestPatients.createEvaGriffiths();
    const patientOverview = new PatientOverview();
    patientOverview.patient = patient;
    const goal = TestGoals.build();
    const fetchGoalsSubject = new Subject<Goal>();
    const pathway = TestPathways.build()[0];
    @Component({ template: '' })
    class MockComponent {}

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [GoalDetailsComponent, MockComponent],
            providers: [
                ComponentsFactory,
                {
                    provide: GoalService,
                    useValue: {
                        goal: fetchGoalsSubject,
                    },
                },
            ],
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [MockComponent],
            },
        });
    });

    beforeEach(() => {
        service = TestBed.get(GoalService);
        factory = TestBed.get(ComponentsFactory);
        factory.addPart({ [goal.type]: MockComponent });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GoalDetailsComponent);
        component = fixture.componentInstance;
        component.patient = patientOverview;
        component.pathway = pathway;
        fixture.detectChanges();
    });

    it('should set the patient on the service', () => {
        expect(service.patient).toBe(patientOverview);
    });

    describe('when the goal has been fetched', () => {
        const concreteGoalDetails = MockComponent;

        beforeEach(() => {
            fetchGoalsSubject.next(goal);
            fixture.detectChanges();
        });

        it('should show the concrete goal details component', () => {
            expect(
                fixture.debugElement.query(By.directive(concreteGoalDetails)),
            ).toBeTruthy();
        });
    });
});
