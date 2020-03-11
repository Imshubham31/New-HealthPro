import { HttpClientModule } from '@angular/common/http';
import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthenticationModule } from '@lib/authentication/authentication.module';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { HospitalModule } from '@lib/hospitals/hospital.module';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { of } from 'rxjs';
import { Hospital } from './hospital.model';

describe('Hospital Service', () => {
    const mockHospital: Hospital = { id: 'hospitalId' };
    let injector: TestBed;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HospitalModule, AuthenticationModule],
            providers: [
                AuthenticationService,
                {
                    provide: HospitalsRestService,
                    useValue: {
                        findOne: () => {
                            return of({ data: mockHospital });
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
    });

    beforeEach(() => {
        spyOn(AuthenticationService, 'getUser').and.returnValue({
            hospitalId: mockHospital.id,
        });
    });

    it('should fetch hospital', () => {
        const hospitalService = injector.get(HospitalService);
        const hospitalsRestService = injector.get(HospitalsRestService);
        const spy = spyOn(hospitalsRestService, 'findOne').and.callFake(() =>
            of({ data: mockHospital }),
        );
        hospitalService.fetchHospital().subscribe(next => {
            expect(next.id).toBe(mockHospital.id);
            expect(spy).toHaveBeenCalledTimes(1);
        });
        spy.calls.reset();
        hospitalService.fetchHospital().subscribe(next => {
            expect(next.id).toBe(mockHospital.id);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('can add a patient', () => {
        it('should return true if autoPatientEnrollment is false', () => {
            const firstHospital: Hospital = { autoPatientEnrollment: false };
            const hospitalService = injector.get(HospitalService);
            hospitalService.hospital.next(firstHospital);
            hospitalService.canAddPatient().subscribe(val => {
                expect(val).toBe(true);
            });
        });
        it('should return false if autoPatientEnrollment is set to true', () => {
            const firstHospital: Hospital = { autoPatientEnrollment: true };
            const hospitalService = injector.get(HospitalService);
            hospitalService.hospital.next(firstHospital);
            hospitalService.canAddPatient().subscribe(val => {
                expect(val).toBe(false);
            });
        });
    });
});
