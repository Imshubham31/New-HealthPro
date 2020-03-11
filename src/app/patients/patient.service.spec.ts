import { PatientRestService } from './patient-rest.service';
import { TestHCPs } from 'test/support/test-hcps';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { TestCareModules } from './../../test/support/test-caremodules';
import { ChangePathwayState } from './change-pathway/change-pathway-coordinator';
import { TestBed } from '@angular/core/testing';
import { empty, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TestPatientOverview } from 'test/support/test-patient-overview';
import { MDTService } from '../mdt/mdt.service';
import { Patient, MdtsHcps } from './patient.model';
import { PatientService } from './patient.service';
import { PatientsRestService } from './patients-rest.service';

import SpyObj = jasmine.SpyObj;
import { TestMDTs } from 'test/support/test-mdts';
describe('PatientService', () => {
    let service: PatientService;
    let patientsRestService: SpyObj<PatientsRestService>;
    let mdtService: SpyObj<MDTService>;
    const patientOverview = TestPatientOverview.build();
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientService,
                {
                    provide: PatientsRestService,
                    useValue: jasmine.createSpyObj('patientsRestService', [
                        'find',
                        'findOne',
                        'patch',
                        'create',
                        'getLatestHeight',
                        'changePathway',
                    ]),
                },
                {
                    provide: PatientRestService,
                    useValue: jasmine.createSpyObj('patientRestService', [
                        'deletePatient',
                    ]),
                },
                {
                    provide: MDTService,
                    useValue: jasmine.createSpyObj('mdtService', [
                        'assignMdtTo',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        service = TestBed.get(PatientService);
        patientsRestService = TestBed.get(PatientsRestService);
        mdtService = TestBed.get(MDTService);
        patientsRestService.find.and.returnValue(
            of({ data: [patientOverview] }),
        );
        patientsRestService.findOne.and.returnValue(
            of({ data: patientOverview }),
        );
    });

    afterEach(() => {
        expect(service.store$.value.isFetching).toBe(false);
        AuthenticationService.deleteUser();
    });

    describe('getPatients$()', () => {
        beforeEach(() => service.fetchPatients().subscribe());
        it('should get items', () => {
            service.getPatients$().subscribe(res => {
                expect(res.list).toEqual([patientOverview]);
            });
        });
    });

    describe('getPatient$(id: string)', () => {
        it('should get item from store', () => {
            service.fetchPatients().subscribe();
            service.getPatients$().subscribe();
            service
                .getPatient$(patientOverview.patient.backendId)
                .subscribe(next => {
                    expect(next).toEqual(patientOverview);
                });
            expect(patientsRestService.findOne).not.toHaveBeenCalled();
        });
    });

    describe('assignMDTto(patient: PatientOverview)', () => {
        it('should assignMdt', done => {
            const mdts = TestMDTs.build({
                patientId: patientOverview.patient.backendId,
            });
            const mdt = mdts[0];
            mdtService.assignMdtTo.and.returnValue(of(mdt));
            service.updateStoreWithEntity(patientOverview, 'patient.backendId');
            service.assignMDTto(patientOverview, mdt).subscribe();
            service
                .getPatient$(patientOverview.patient.backendId)
                .subscribe(patient => {
                    expect(patient.patient.mdts[0].id).toBe(mdt.id);
                    done();
                });
        });
    });

    describe('update(patient: Patient)', () => {
        beforeEach(() => service.getPatients$().subscribe());
        it('should update', () => {
            patientsRestService.patch.and.returnValue(of({}));
            const patient: Patient = { ...patientOverview.patient };
            patient.firstName = 'test';
            service.store$.next({ list: [patientOverview], isFetching: false });
            service.update(patient).subscribe();
            service
                .getPatient$(patient.backendId)
                .subscribe(next => expect(next.patient.firstName).toBe('test'));
        });
        it('should fail and handle', () => {
            patientsRestService.patch.and.returnValue(throwError({}));
            const patient: Patient = { ...patientOverview.patient };
            patient.firstName = 'test';
            service
                .update(patient)
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return empty();
                    }),
                )
                .subscribe();
            service
                .getPatient$(patient.backendId)
                .subscribe(null, err => expect(err).toBeDefined());
        });
    });
    describe('create(patient: Patient)', () => {
        it('should create', () => {
            patientsRestService.create.and.returnValue(of({}));
            service.create(patientOverview.patient).subscribe(() => {
                service
                    .getPatient$(patientOverview.patient.backendId)
                    .subscribe(next => {
                        expect(next.patient.backendId).toBe(
                            patientOverview.patient.backendId,
                        );
                    });
            });
        });

        it('should fail and handle', () => {
            patientsRestService.create.and.returnValue(throwError({}));
            service
                .create(patientOverview.patient)
                .pipe(catchError(() => empty()))
                .subscribe(null, err => expect(err).toBeDefined());
        });
    });
    describe('getPatientLatestHeight(patientId: string): Observable<HeightRecord>', () => {
        const heightResponse = { height: { value: 1, unit: 'cm' } };
        it('should get latest height', () => {
            patientsRestService.getLatestHeight.and.returnValue(
                of({ data: [heightResponse] }),
            );
            service
                .getPatientLatestHeight(patientOverview.patient.backendId)
                .subscribe(next => expect(next).toEqual(heightResponse.height));
        });

        it('should fail and handle', () => {
            patientsRestService.getLatestHeight.and.returnValue(throwError({}));
            service
                .getPatientLatestHeight(patientOverview.patient.backendId)
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return empty();
                    }),
                )
                .subscribe(next => expect(next).toEqual(heightResponse.height));
        });
    });

    xdescribe('changePathway', () => {
        // let patientOverview: PatientOverview;
        let state: ChangePathwayState;
        beforeEach(() => {
            // patientOverview = TestPatientOverview.build();
            state = {
                mdtHcps: MdtsHcps.fromMDts(patientOverview.patient.mdts),
                nextCareModule: TestCareModules.build('1'),
                previousCareModule: TestCareModules.build('1'),
                surgery: patientOverview.patient.surgery,
                isSubmitting: true,
            };
        });
        it('should call change pathway on the rest service', () => {
            const spy = patientsRestService.changePathway.and.returnValue(
                of({}),
            );
            service.changePathway(patientOverview.patient.backendId, state);
            const payload = {
                pathwayId: state.nextCareModule.pathwayId,
                caremoduleId: state.nextCareModule.id,
                surgery: state.surgery,
                personalMdt: state.mdtHcps.personalMdt,
                sharedMdtIds: state.mdtHcps.sharedMdtIds,
            };
            expect(spy).toHaveBeenCalledWith(
                patientOverview.patient.backendId,
                payload,
            );
        });
        it('should fetch the patient on success', () => {
            patientsRestService.changePathway.and.returnValue(of({}));
            const spy = spyOn(service, 'fetchPatientWithId');
            spy.and.returnValue(of(patientOverview));
            service
                .changePathway(patientOverview.patient.backendId, state)
                .subscribe();
            expect(spy).toHaveBeenCalledWith(patientOverview.patient.backendId);
        });
    });
});
