import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { TestPatients } from '../../../test/support/test-patients';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SurgeonsService } from '../add-patient/surgery-details/surgeons.service';
import { Patient } from '../patient.model';
import { PatientService } from '../patient.service';
import { Surgery } from '../surgery.model';
import { EditPatientComponent } from './edit-patient.component';
import { Stores } from '@lib/utils/stores';
import { Surgeon } from '../add-patient/surgery-details/surgeon.model';
import { SharedModule } from '@lib/shared/shared.module';
import { APP_BASE_HREF } from '@angular/common';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { Languages } from '@lib/localise/languages';
import { LocaliseService } from '@lib/localise/localise.service';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { EditPatientComponentPage } from './edit-patient.page-object';
import { TestSurgeons } from 'test/support/test-surgeons';
import { spyOnSubscription } from 'test/support/custom-spies';
import { Hospital } from '@lib/hospitals/hospital.model';

describe('EditPatientComponent', () => {
    let page: EditPatientComponentPage;
    const patientServiceSpy = jasmine.createSpyObj('patientService', {
        update: of(),
    });
    let hospitalService: jasmine.SpyObj<HospitalService>;
    const patient = TestPatients.createEvaGriffiths();
    const updatedPatient = TestPatients.build({
        ...patient,
        firstName: 'EvaFirstNameCorrection',
        lastName: 'EvaLastNameCorrection',
    });
    const hospital = {
        id: '1',
        name: 'Test Hospital',
        integrated: false,
    };

    const mockLang = {
        strings: {
            assignedRole: (params: string[]) =>
                `Assigned ${params[0]} (inactive)`,
        },
        dir: 'ltr',
    };

    const mockSurgeonService = {
        store$: new Stores.StoreFactory<Surgeon>().make(),
        fetchSurgeons: () => of([TestSurgeons.build('1')]),
        getSurgeons$: () => of({}),
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [EditPatientComponent, MockLocalisePipe],
            imports: [LocaliseModule, SharedModule],
            providers: [
                {
                    provide: PatientService,
                    useValue: patientServiceSpy,
                },
                { provide: SurgeonsService, useValue: mockSurgeonService },
                { provide: APP_BASE_HREF, useValue: '/' },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital(): Observable<Hospital> {
                            return of(hospital);
                        },
                        hospital: of(hospital),
                    },
                },
                { provide: Languages, useValue: { en: mockLang } },
                LocaliseService,
                RestrictProcessingPipe,
            ],
        });
    });

    beforeEach(() => {
        page = new EditPatientComponentPage(
            TestBed.createComponent(EditPatientComponent),
        );
        const localiseService = TestBed.get(LocaliseService);
        localiseService.use('en');
    });

    describe('when created', () => {
        it('should check is hospital is integrated', () => {
            hospitalService = TestBed.get(HospitalService);
            const hospitalSpy = spyOnSubscription(
                hospitalService,
                'fetchHospital',
                of(hospital),
            );
            page.component.checkIfIntegrated();
            expect(hospitalSpy.subscribe).toHaveBeenCalledTimes(1);
        });
    });
    describe('when submitted', () => {
        it('should update the patient', () => {
            setUpPatient(patient);
            page.component.form.setValue(updatedPatient);
            submit();
            const expectedSurgery = new Surgery();
            expectedSurgery.surgeon = updatedPatient.surgery.surgeon;
            expectedSurgery.startDateTime =
                updatedPatient.surgery.startDateTime;

            const expectedPatient = new Patient();
            expectedPatient.idmsId = updatedPatient.idmsId;
            expectedPatient.backendId = updatedPatient.backendId;
            expectedPatient.firstName = updatedPatient.firstName;
            expectedPatient.lastName = updatedPatient.lastName;
            expectedPatient.gender = updatedPatient.gender;
            expectedPatient.dob = updatedPatient.dob;
            expectedPatient.phoneNumber = updatedPatient.phoneNumber;
            expectedPatient.surgery = expectedSurgery;

            expect(patientServiceSpy.update).toHaveBeenCalledWith(
                expectedPatient,
            );
        });
    });

    function submit() {
        page.fixture.debugElement
            .query(By.css('form'))
            .triggerEventHandler('ngSubmit', null);
    }

    function setUpPatient(newPatient: Patient) {
        page.component.patient = newPatient;
        page.component.open();
        page.fixture.detectChanges();
    }
});
