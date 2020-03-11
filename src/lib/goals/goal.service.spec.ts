import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PatientsRestService } from 'app/patients/patients-rest.service';
import { Pathway } from '@lib/pathway/pathway.model';
import { User } from '@lib/authentication/user.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { SharedModule } from '@lib/shared/shared.module';
import { Goal, GoalType } from '@lib/goals/goal.model';
import { GoalService } from '@lib/goals/goal.service';
import { GoalsRestService } from '@lib/goals/goals-rest.service';
import { of } from 'rxjs';

const mockGoals: Goal = {
    initial: 120,
    latestRecordValue: 100,
    pathwayId: '1',
    phaseId: '10',
    subphaseId: '100',
    records: [
        {
            value: 100,
            dateTime: new Date(),
        },
    ],
    type: GoalType.weight,
};

const mockPatientsRestService = {
    getGoals: id => {
        return of([mockGoals]);
    },
};

const mockGoalsRestService = {
    createRecord: (id, record) => {
        return of({});
    },
    patch: (id, goal) => {
        return of({});
    },
};

const mockPathway: Pathway = {
    id: '1',
    title: 'Dummy Pathway',
    currentPhaseId: '10',
    currentSubphaseId: '100',
    phases: [],
};

const mockUser = new User();
mockUser.units = '10';

let goalService: GoalService;

describe('Goal Details Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, SharedModule],
            providers: [
                GoalService,
                {
                    provide: PatientsRestService,
                    useValue: mockPatientsRestService,
                },
                {
                    provide: GoalsRestService,
                    useValue: mockGoalsRestService,
                },
            ],
        });
        goalService = TestBed.get(GoalService);
        goalService.goal.next(mockGoals);
        AuthenticationService.setUser(mockUser);
    });

    it('should calculate correct excess weight loss', () => {
        const excess = goalService.getExcessWeightLoss(180);
        expect(excess).toEqual(51.28);
    });

    it('should get calculate correct BMI', () => {
        const excess = goalService.getBmi(180);
        expect(excess).toEqual(30.86);
    });

    it('should get calculate correct ideal body weight', () => {
        const excess = goalService.getIdealBodyWeight(180);
        expect(excess).toEqual(81);
    });

    it('should fetch patient goal', async(() => {
        goalService.fetchPatientGoal('1', mockPathway).subscribe(goal => {
            expect(goal).toBeDefined();
            expect(goal.initial).toEqual(120);
        });
    }));

    it('should throw error when no matching goal', async(() => {
        const testBedService = TestBed.get(PatientsRestService);
        spyOn(testBedService, 'getGoals').and.returnValue(of({}));
        goalService.fetchPatientGoal('1', mockPathway).subscribe(
            goal => {},
            error => {
                expect(error.message).toBeDefined();
            },
        );
    }));

    it('should create a record', async(() => {
        goalService.createRecord(113, GoalType.weight).subscribe(() => {
            expect(goalService.goal.value.records[1].value).toEqual(113);
        });
    }));

    it('should update a goal target', async(() => {
        goalService.updateGoalTarget(199).subscribe(() => {
            expect(goalService.goal.value.target).toEqual(199);
        });
    }));

    it('should update a goals initial weight', async(() => {
        goalService.updateInitialWeight(80).subscribe(() => {
            expect(goalService.goal.value.initial).toEqual(80);
        });
    }));
});
