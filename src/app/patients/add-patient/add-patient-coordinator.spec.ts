import { TestCareModules } from 'test/support/test-caremodules';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TestPatientOverview } from 'test/support/test-patient-overview';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { Patient } from '../patient.model';
import { PatientService } from '../patient.service';
import {
    AddPatientCoordinator,
    AddPatientStages,
} from './add-patient-coordinator.service';
import { CareModuleModel } from './care-module/care-module.model';
import { CareModulesService } from './care-module/caremodules.service';
import { SharedModule } from '@lib/shared/shared.module';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Surgery } from '../surgery.model';
import { Surgeon } from './surgery-details/surgeon.model';

const mockCareModule: CareModuleModel = {
    id: '1',
    title: 'Gastric band',
    description:
        'A laparoscopic adjustable gastric band, commonly called a lap-band, ' +
        'A band, or LAGB, is an inflatable silicone device placed around the top portion of ' +
        'the stomach to treat obesity, intended to slow consumption of food and thus reduce the amount of food consumed.',
    pathwayId: '1',
};

const mockCaremoduleService = {
    store$: new BehaviorSubject({
        list: [mockCareModule],
        isFetching: false,
    }),
    fetchCareModules$: () => {
        return of([mockCareModule]);
    },
};

describe('AddPatientCoordinator', () => {
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    let addPatientCoordinator: AddPatientCoordinator;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
                LocaliseModule,
            ],
            providers: [
                AuthenticationService,
                RouterTestingModule,
                AddPatientCoordinator,
                LocaliseService,
                ErrorPipe,
                {
                    provide: PatientService,
                    useValue: {
                        create: () => of(TestPatientOverview.build()),
                    },
                },
                { provide: Router, useValue: mockRouter },
                {
                    provide: CareModulesService,
                    useValue: mockCaremoduleService,
                },
            ],
        });
        addPatientCoordinator = TestBed.get(AddPatientCoordinator);
    });

    it('should set patient personal details with consent', () => {
        const patient = new Patient();
        patient.firstName = 'bob';
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            hospitalId: '1',
        });
        addPatientCoordinator.savePersonalDetails(patient);
        expect(addPatientCoordinator.stage$.getValue()).toBe(
            AddPatientStages.CareModules,
        );
        expect(addPatientCoordinator.patient.firstName).toBe('bob');
        expect(addPatientCoordinator.patient.careModuleId).not.toBeDefined();
    });

    it('should set the care module details', () => {
        const careModule = TestCareModules.build();
        addPatientCoordinator.saveCareModules(careModule);
        expect(addPatientCoordinator.stage$.getValue()).toBe(
            AddPatientStages.SurgeryDetails,
        );
        expect(addPatientCoordinator.patient.careModuleId).toBe(careModule.id);
    });

    it('should get the title', () => {
        const localiseService = TestBed.get(LocaliseService);
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.PersonalDetails,
        );
        expect(addPatientCoordinator.getTitle()).toBe(
            localiseService.fromKey('addNewPatient'),
        );
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.CareModules,
        );
        expect(addPatientCoordinator.getTitle()).toBe(
            localiseService.fromKey('careModules'),
        );
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.SurgeryDetails,
        );
        expect(addPatientCoordinator.getTitle()).toBe(
            localiseService.fromKey('surgeryInformation'),
        );
    });

    it('should get the subTitle', () => {
        const patient = new Patient();
        patient.firstName = 'bob';
        patient.lastName = 'alice';
        addPatientCoordinator.patient = patient;
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.PersonalDetails,
        );
        expect(addPatientCoordinator.getSubtitle()).toBeNull();
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.CareModules,
        );
        expect(addPatientCoordinator.getSubtitle()).toContain(
            `${patient.firstName} ${patient.lastName}`,
        );
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.SurgeryDetails,
        );
        expect(addPatientCoordinator.getSubtitle()).toContain(
            `${patient.firstName} ${patient.lastName}`,
        );
    });

    it('should reset', () => {
        addPatientCoordinator.stage$ = new BehaviorSubject(
            AddPatientStages.SurgeryDetails,
        );
        addPatientCoordinator.reset();
        expect(addPatientCoordinator.stage$.getValue()).toEqual(
            AddPatientStages.PersonalDetails,
        );
    });

    it('should save all details', done => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            hospitalId: '1',
        });
        addPatientCoordinator.saveAllDetails().subscribe(next => {
            expect(next).toBeDefined();
            done();
        });
    });

    it('should save surgery', () => {
        const surgery = new Surgery(
            new Surgeon('1', 'test', 'test'),
            new Date(),
        );
        addPatientCoordinator.saveSurgery(surgery);
        expect(addPatientCoordinator.patient.surgery).toEqual(surgery);
    });

    it('should finish', () => {
        const completeNextSpy = spyOn(
            addPatientCoordinator.onComplete$,
            'next',
        );
        addPatientCoordinator.finish();
        expect(completeNextSpy).toHaveBeenCalled();
    });
});

describe('AddPatientCoordinator create failing scenario', () => {
    let addPatientCoordinator: AddPatientCoordinator;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
                LocaliseModule,
            ],
            providers: [
                AuthenticationService,
                RouterTestingModule,
                AddPatientCoordinator,
                LocaliseService,
                ErrorPipe,
                {
                    provide: PatientService,
                    useValue: {
                        create: () => throwError(new Error('error')),
                    },
                },
                {
                    provide: CareModulesService,
                    useValue: mockCaremoduleService,
                },
            ],
        });
        addPatientCoordinator = TestBed.get(AddPatientCoordinator);
    });

    it('should fail to save', done => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            hospitalId: '1',
        });
        addPatientCoordinator.saveAllDetails().subscribe(
            () => {},
            err => {
                expect(err).not.toBeNull();
                done();
            },
        );
    });

    it('should clear care module', () => {
        addPatientCoordinator.patient.careModuleId = 'test';
        addPatientCoordinator.patient.pathwayId = 'test';
        addPatientCoordinator.clearCareModule();
        expect(addPatientCoordinator.patient.careModuleId).toBeUndefined();
        expect(addPatientCoordinator.patient.pathwayId).toBeUndefined();
    });
});
