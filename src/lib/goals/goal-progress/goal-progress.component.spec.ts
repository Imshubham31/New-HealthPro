import { WeightProgressState } from './weight-progress.state';
import { StepsProgressState } from './steps-progress.state';
import { GoalService } from '@lib/goals/goal.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GoalProgressComponent } from './goal-progress.component';
import { UnitsUtils } from '@lib/utils/units-utils';
import { StepsService } from '../steps.service';
import { TestPatients } from 'test/support/test-patients';
import { of, throwError } from 'rxjs';
import { GoalType } from '../goal.model';

let component: GoalProgressComponent;
let fixture: ComponentFixture<GoalProgressComponent>;
const goalMock = {
    type: GoalType.weight,
};
const fetchPatientGoal = {
    result: of(true),
};
describe('Goal progress Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [GoalProgressComponent],
            providers: [
                UnitsUtils,
                {
                    provide: StepsService,
                    useValue: {
                        weeklyStepsData: goal => ({
                            seriesData: [],
                        }),
                    },
                },
                {
                    provide: GoalService,
                    useValue: {
                        fetchPatientGoal: (id, pw) => fetchPatientGoal.result,
                        goal: of(goalMock),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(GoalProgressComponent);
        component = fixture.componentInstance;
        component.patient = TestPatients.createEvaGriffiths();
        fixture.detectChanges();
    });
    it('should handle steps goal', () => {
        goalMock.type = GoalType.stepCount;
        component.ngOnInit();
        expect(component.state).toEqual(jasmine.any(StepsProgressState));
    });
    it('should handle weight goal', () => {
        goalMock.type = GoalType.weight;
        component.ngOnInit();
        expect(component.state).toEqual(jasmine.any(WeightProgressState));
    });
    it('should handle unknown goal', () => {
        goalMock.type = undefined;
        component.failed = false;
        component.ngOnInit();
        expect(component.failed).toBeTruthy();
    });
    it('should handle fetchValue error', () => {
        fetchPatientGoal.result = throwError('error');
        component.failed = false;
        component.fetchValue();
        expect(component.failed).toBeTruthy();
    });
});
