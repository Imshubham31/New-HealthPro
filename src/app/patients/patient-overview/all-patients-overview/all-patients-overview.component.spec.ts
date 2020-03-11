import { LocaliseService } from '@lib/localise/localise.service';
import { AddPatientCoordinator } from '../../add-patient/add-patient-coordinator.service';
import { AllPatientsOverviewComponent } from './all-patients-overview.component';
import { CommonModule } from '@angular/common';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HcpMessagesService } from './../../../messages/messages.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { of } from 'rxjs';
import { PaginationService } from 'ngx-pagination';
import { PatientService } from 'app/patients/patient.service';
import SpyObj = jasmine.SpyObj;
import { TestPatientOverview } from 'test/support/test-patient-overview';

@Component({
    selector: 'app-pagination-controls',
    template: '<p>app-pagination-controls</p>',
})
class MockAppPaginationControlsComponent {}
@Component({
    selector: 'hospital-logo',
    template: '<p>hospital-logo</p>',
})
class MockHospitalLogoComponent {
    @Input() center: any;
}
@Component({
    selector: 'patient-card-row',
    template: '<p>patient-card-row</p>',
})
class MockPatientCardRowComponent {
    @Input() patient: any;
}
@Component({
    selector: 'app-search-input',
    template: '<p>app-search-input</p>',
})
class MockSearchInputComponent {
    @Input() dataSource: any;
    @Input() keys: any;
    @Input() placeholder: any;
}

@Pipe({ name: 'sortOn' })
class MockSortOnPipe implements PipeTransform {
    transform(value: any[], args: any): any[] {
        return value;
    }
}

@Pipe({ name: 'paginate' })
class MockPaginatePipe implements PipeTransform {
    transform(value: any[], itemsPerPage: any, currentPage: any): any[] {
        return value;
    }
}

describe('AllPatientsOverviewComponent', () => {
    let component: AllPatientsOverviewComponent;
    let fixture: ComponentFixture<AllPatientsOverviewComponent>;
    let patientService: SpyObj<PatientService>;
    let localise: SpyObj<LocaliseService>;
    let messagesService: SpyObj<HcpMessagesService>;
    const mockPatient = {
        firstName: 'Name',
        lastName: 'Last name',
        consent: true,
        gender: 'M',
        dob: new Date(),
        email: 'email',
        phoneNumber: '12343',
        patient_id: 2,
    };
    const patients = [TestPatientOverview.build({ withMdt: true })];
    patients.push(TestPatientOverview.build({ withMdt: true }));
    patients[1].patient.onboardingState.hasConsented = false;
    const mockCoordinator = {
        addedPatients: () => {
            return [
                {
                    patient: mockPatient,
                    careModule: {
                        title: 'care module 1',
                        description: 'a sub',
                        id: 12,
                    },
                    surgery: {
                        surgeon: {
                            userId: 123,
                            name: 'Super Surgeon',
                        },
                        surgeryDate: new Date(),
                    },
                },
            ];
        },
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, CommonModule, FormsModule],
            declarations: [
                AllPatientsOverviewComponent,
                MockAppPaginationControlsComponent,
                MockHospitalLogoComponent,
                MockPaginatePipe,
                MockPatientCardRowComponent,
                MockSearchInputComponent,
                MockSortOnPipe,
            ],
            providers: [
                { provide: AddPatientCoordinator, useValue: mockCoordinator },
                {
                    provide: HcpMessagesService,
                    useValue: jasmine.createSpyObj('hcpMessagesService', [
                        'fetchItems$',
                    ]),
                },
                {
                    provide: HospitalService,
                    useValue: jasmine.createSpyObj('hospitalService', [
                        'fetchHospital',
                    ]),
                },
                {
                    provide: PatientService,
                    useValue: jasmine.createSpyObj('patientsService', [
                        'fetchPatients',
                        'getPatients$',
                    ]),
                },
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localiseService', [
                        'fromKey',
                        'getLocale',
                        'fromParams',
                    ]),
                },
                { provide: PaginationService, useValue: {} },
            ],
        });
    });

    beforeEach(() => {
        patientService = TestBed.get(PatientService);
        fixture = TestBed.createComponent(AllPatientsOverviewComponent);
        component = fixture.componentInstance;
        component.search.results = [];
    });

    afterEach(() => {
        patientService.fetchPatients.calls.reset();
        patientService.getPatients$.calls.reset();
    });

    describe('loadDetails', () => {
        beforeEach(() => {
            localise = TestBed.get(LocaliseService);
            localise.fromKey.and.callFake(key => key);
        });
        it('should sortLabel on lastName', () => {
            component.sortOn('patient.lastName', 'ASC');
            expect(component.sortLabel).toBe('lastName');
        });
        it('should sortLabel on firstName', () => {
            component.sortOn('patient.firstName', 'ASC');
            expect(component.sortLabel).toBe('firstName');
        });
        it('should sortLabel with defualt params', () => {
            component.sortOn('patient.any', 'ASC');
            expect(component.sortLabel).toBe('sortBy');
        });
    });

    describe('loadPatients', () => {
        beforeEach(() => {
            patientService = TestBed.get(PatientService);
            messagesService = TestBed.get(HcpMessagesService);
            messagesService.fetchItems$.and.returnValue(of([]));
            patientService.fetchPatients.and.returnValue(of(patients));
            patientService.getPatients$.and.returnValue(of({ list: patients }));
        });
        it('should fetch the patients', () => {
            component.ngOnInit();
            expect(patientService.fetchPatients).toHaveBeenCalledTimes(1);
            expect(patientService.getPatients$).toHaveBeenCalledTimes(1);
            expect(component.patients.length).toBe(1);
        });
    });
});
