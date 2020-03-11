import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import SpyObj = jasmine.SpyObj;

import { UserUnitsPipe } from '@lib/shared/services/userUnits.pipe';
import { LocaliseModule } from '@lib/localise/localise.module';
import { UnitsUtils } from '@lib/utils/units-utils';
import { PatientsRestService } from '../../../patients/patients-rest.service';
import { TestGoals } from '../../../../test/support/test-goals';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { TestHCPs } from '../../../../test/support/test-hcps';
import { PatientOverview } from '../../../patients/view-patient.model';
import { TestPatients } from '../../../../test/support/test-patients';
import { WeightGoalDetailsComponent } from './weight.component';
import { GoalService } from '@lib/goals/goal.service';
import { GoalType } from '@lib/goals/goal.model';
import { empty } from 'rxjs';
import { StepsService } from '@lib/goals/steps.service';

class PageObject {
    constructor(
        private fixture: ComponentFixture<WeightGoalDetailsComponent>,
    ) {}

    get currentWeight() {
        return this.fixture.debugElement.query(By.css('#weight'));
    }

    get height() {
        return this.fixture.debugElement.query(By.css('#height'));
    }

    get bmi() {
        return this.fixture.debugElement.query(By.css('#bmi'));
    }

    get goal() {
        return this.fixture.debugElement.query(By.css('#goalWeight'));
    }
}

describe('WeightGoalDetailsComponent', () => {
    let fixture: ComponentFixture<WeightGoalDetailsComponent>;
    let page: PageObject;
    let service: SpyObj<GoalService>;
    let patientService: SpyObj<PatientsRestService>;

    const patient = TestPatients.createEvaGriffiths();
    const patientOverview = new PatientOverview();
    patientOverview.patient = patient;
    const bmi = '24.8';

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [WeightGoalDetailsComponent, UserUnitsPipe],
            providers: [
                UnitsUtils,
                {
                    provide: PatientsRestService,
                    useValue: jasmine.createSpyObj('patientsRestService', [
                        'updateHeight',
                    ]),
                },
                {
                    provide: GoalService,
                    useValue: jasmine.createSpyObj('goalDetailsService', [
                        'createRecord',
                        'getBmi',
                        'updateGoalTarget',
                        'getIdealBodyWeight',
                        'getExcessWeightLoss',
                    ]),
                },
                {
                    provide: StepsService,
                    useValue: {
                        weeklyStepsData: goal => ({
                            seriesData: [],
                        }),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        spyOn(AuthenticationService, 'getUser').and.returnValue(
            TestHCPs.createDrCollins(),
        );
    });

    beforeEach(() => {
        service = TestBed.get(GoalService);
        (service as GoalService).goal = new BehaviorSubject(TestGoals.build());
        (service as GoalService).patient = patientOverview;
        service.getBmi.and.returnValue(bmi);
        service.createRecord.and.returnValue(empty());
        service.updateGoalTarget.and.returnValue(empty());

        patientService = TestBed.get(PatientsRestService);
        patientService.updateHeight.and.returnValue(empty());
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WeightGoalDetailsComponent);
        fixture.detectChanges();
        page = new PageObject(fixture);
    });

    it('should have an editable field for the current weight', () => {
        expect(page.currentWeight).toBeTruthy();
    });

    describe('when the current weight changes', () => {
        const value = '42';

        it('should create a record', () => {
            page.currentWeight.triggerEventHandler('valueChanged', value);

            expect(service.createRecord).toHaveBeenCalledWith(
                Number(value),
                GoalType.weight,
            );
        });
    });

    it('should have an editable field for the height', () => {
        expect(page.height).toBeTruthy();
    });

    describe('when the height changes', () => {
        const value = '42';

        it('should update the patients height', () => {
            page.height.triggerEventHandler('valueChanged', value);

            expect(patientService.updateHeight).toHaveBeenCalledWith(
                patient.backendId,
                Number(value),
            );
        });
    });

    it('should show the BMI', () => {
        expect(service.getBmi).toHaveBeenCalledWith(patient.height);
        expect(page.bmi.nativeElement.textContent.trim()).toEqual(bmi);
    });

    it('should have an editable field for the step count', () => {
        expect(page.goal).toBeTruthy();
    });

    describe('when the goal changes', () => {
        const value = '42';

        it('should update the goal', () => {
            page.goal.triggerEventHandler('valueChanged', value);

            expect(service.updateGoalTarget).toHaveBeenCalledWith(
                Number(value),
            );
        });
    });
});
