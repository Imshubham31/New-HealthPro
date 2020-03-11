import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestHCPs } from '../../../test/support/test-hcps';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { UnitsUtils } from '@lib/utils/units-utils';
import { GoalProgressComponent } from './goal-progress.component';
import { StepsProgressState } from './steps-progress.state';
import { WeightProgressState } from './weight-progress.state';
import { Goal, GoalType } from '@lib/goals/goal.model';
import { GoalService } from '@lib/goals/goal.service';
import { StepsService } from '@lib/goals/steps.service';
import { addDays } from 'date-fns';

xdescribe('GoalProgressState', () => {
    describe('StepsProgressState', () => {
        const today = new Date(2018, 4, 28);
        beforeEach(() => {
            jasmine.clock().mockDate(today);
        });
        const goal = new Goal();
        goal.records = [
            {
                value: 500,
                dateTime: today,
            },
        ];
        goal.target = 1000;
        goal.initial = 0;
        goal.type = GoalType.stepCount;

        let fixture: ComponentFixture<GoalProgressComponent>;
        let component: GoalProgressComponent;
        let localise: LocaliseService;

        configureTestSuite(() => {
            TestBed.configureTestingModule({
                imports: [LocaliseModule],
                declarations: [GoalProgressComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    UnitsUtils,
                    {
                        provide: GoalService,
                        useValue: {},
                    },
                    StepsService,
                ],
            });

            fixture = TestBed.createComponent(GoalProgressComponent);
            component = fixture.componentInstance;
            localise = TestBed.get(LocaliseService);
        });

        it('should handle goal', () => {
            const state = new StepsProgressState(
                component,
                TestBed.get(StepsService),
            );
            state.handleGoal(goal);

            const avg = 500;
            expect(component.failed).toBeFalsy();
            expect(component.centerText).toBe(`${avg}`);
            expect(component.currentValue).toBe((avg / goal.target) * 100);
            expect(component.subtext).toBe(localise.fromKey('avgWeeklySteps'));
        });

        it('should handle goal with no records', () => {
            const badGoal = new Goal();
            badGoal.records = [];
            badGoal.target = 1;
            new StepsProgressState(
                component,
                TestBed.get(StepsService),
            ).handleGoal(badGoal);
            expect(component.failed).toBeFalsy();
            expect(component.centerText).toBe('0');
            expect(component.currentValue).toBe(0);
            expect(component.subtext).toBe(localise.fromKey('avgWeeklySteps'));
        });
    });

    describe('WeightProgressState', () => {
        const today = new Date(2018, 4, 28);
        beforeEach(() => {
            jasmine.clock().mockDate(today);
            AuthenticationService.setUser(TestHCPs.createDrCollins());
        });
        afterEach(() => AuthenticationService.deleteUser());
        const goal = new Goal();
        goal.records = [
            {
                value: 100,
                dateTime: today,
            },
            {
                value: 50,
                dateTime: addDays(today, 1),
            },
        ];
        goal.target = 30;
        goal.initial = 200;
        goal.type = GoalType.weight;

        let fixture: ComponentFixture<GoalProgressComponent>;
        let component: GoalProgressComponent;
        let localise: LocaliseService;

        configureTestSuite(() => {
            TestBed.configureTestingModule({
                imports: [LocaliseModule],
                declarations: [GoalProgressComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: UnitsUtils,
                        useValue: {
                            convertWeight: value => `${value}`,
                        },
                    },
                    {
                        provide: GoalService,
                        useValue: {},
                    },
                    StepsService,
                ],
            });

            fixture = TestBed.createComponent(GoalProgressComponent);
            component = fixture.componentInstance;
            localise = TestBed.get(LocaliseService);
        });

        describe('with imperial units', () => {
            beforeEach(() => {
                spyOn(AuthenticationService, 'getUser').and.returnValue({
                    units: 'imperial',
                });
                new WeightProgressState(component).handleGoal(goal);
            });

            it('should handle goal', () => assertHandleGoal('pounds'));
        });

        describe('with metric units', () => {
            beforeEach(() => {
                spyOn(AuthenticationService, 'getUser').and.returnValue({
                    units: 'metric',
                });
                new WeightProgressState(component).handleGoal(goal);
            });

            it('should handle goal', () => assertHandleGoal('kilogrammes'));
        });

        it('should handle goal with no records', () => {
            const badGoal = new Goal();
            new WeightProgressState(component).handleGoal(badGoal);
            expect(component.failed).toBe(true);
        });

        it('should handle goal with no weight difference', () => {
            const badGoal = new Goal();
            badGoal.records = [
                {
                    value: 100,
                    dateTime: new Date(),
                },
                {
                    value: 100,
                    dateTime: new Date(),
                },
            ];
            badGoal.initial = 100;
            badGoal.target = 100;
            new WeightProgressState(component).handleGoal(badGoal);
            expect(component.subtext).toBe(
                localise.fromKey('noWeightDifference'),
            );
        });

        it('should handle goal with weight gained', () => {
            spyOn(AuthenticationService, 'getUser').and.returnValue({
                units: 'metric',
            });
            const badGoal = new Goal();
            badGoal.records = [
                {
                    value: 50,
                    dateTime: new Date(),
                },
                {
                    value: 100,
                    dateTime: addDays(new Date(), 1),
                },
            ];
            badGoal.initial = 50;
            badGoal.target = 150;
            new WeightProgressState(component).handleGoal(badGoal);
            expect(component.subtext).toBe(
                `${localise.fromKey('kilogrammes')} ${localise.fromKey(
                    'gained',
                )}`,
            );
        });

        function assertHandleGoal(units: string) {
            const weightDiff = goal.initial - goal.latestRecordValue;
            expect(component.failed).toBeFalsy();
            expect(component.centerText).toBe(`${Math.abs(weightDiff)}`);
            expect(component.currentValue).toBe(
                (weightDiff / (goal.initial - goal.target)) * 100,
            );
            expect(component.subtext).toBe(
                `${localise.fromKey(units)} ${localise.fromKey('lost')}`,
            );
        }
    });
});
