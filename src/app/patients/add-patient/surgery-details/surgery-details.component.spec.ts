import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { SurgeonsService } from './surgeons.service';
import { SurgeryDetailsComponent } from './surgery-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Patient } from '../../patient.model';
import { Surgeon } from './surgeon.model';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';
import { User } from '@lib/authentication/user.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Stores } from '@lib/utils/stores';
import { SharedModule } from '@lib/shared/shared.module';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { of } from 'rxjs';
import { Hospital } from '@lib/hospitals/hospital.model';
import { Surgery } from 'app/patients/surgery.model';
import { TestSurgeons } from 'test/support/test-surgeons';

let comp: SurgeryDetailsComponent;
let fixture: ComponentFixture<SurgeryDetailsComponent>;
let loggedInUser;
const mockAuthenticationService = {
    setUser(user: User) {
        loggedInUser = user;
    },
    getUser() {
        return loggedInUser;
    },
};
const mockAddPatientCoordinator = {
    patient: new Patient(),
    saveSurgery: (surgery: Object) => {},
    saveAllDetails() {
        return this.create(this.patient);
    },
    create: (patient: Object): Observable<RESTSuccess> => {
        mockAuthenticationService.getUser();
        return Observable.create(observer =>
            observer.next({ message: 'success' }),
        );
    },
    finish: () => {},
};

const hospital = {
    id: 'hospitalId',
    name: 'Hospital 1',
    supportedLanguages: ['en'],
    integrated: false,
    gdpr: false,
};

const mockSurgeonService = {
    store$: new Stores.StoreFactory<Surgeon>().make(),
    getSurgeons$: () => of({}),
};

const mockHospitalService = {
    fetchHospital(): Observable<Hospital> {
        return of(hospital);
    },
    hospital: of(hospital),
};

describe('SurgeryDetailsComponent', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, ReactiveFormsModule, LocaliseModule],
            declarations: [SurgeryDetailsComponent],
            providers: [
                {
                    provide: HospitalService,
                    useValue: mockHospitalService,
                },
                {
                    provide: AuthenticationService,
                    useValue: mockAuthenticationService,
                },
                { provide: SurgeonsService, useValue: mockSurgeonService },
                {
                    provide: AddPatientCoordinator,
                    useValue: mockAddPatientCoordinator,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurgeryDetailsComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should submit if valid', () => {
        const addPatientCoordinatorService = TestBed.get(AddPatientCoordinator);
        const spy = spyOn(addPatientCoordinatorService, 'saveSurgery');
        const surgery = new Surgery();
        surgery.surgeon = TestSurgeons.build('2');
        surgery.startDateTime = new Date(2022, 3, 1, 11, 30);
        comp.form.get('surgery').setValue(surgery);
        comp.submit();
        expect(spy).toHaveBeenCalledWith(surgery);
    });

    it('should go to previous page', async(() => {
        comp.onCancel.subscribe(() => {
            expect(comp.form.valid).toBeTruthy();
        });
        comp.previous();
    }));
});
