import { TestCareModules } from 'test/support/test-caremodules';
import { PatientOverview } from './../view-patient.model';
import { TestPatientOverview } from './../../../test/support/test-patient-overview';
import { TestBed } from '@angular/core/testing';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import * as cloneDeep from 'lodash/cloneDeep';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { PatientService } from '../patient.service';
import { EventEmitter } from '@angular/core';
import { spyOnSubscription } from 'test/support/custom-spies';
import { of, throwError } from 'rxjs';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { MdtsHcps } from '../patient.model';

describe('ChangePathwayCoordinator', () => {
    let service: ChangePathwayCoordinator;
    let modalService: jasmine.SpyObj<ModalService>;
    let patientService: jasmine.SpyObj<PatientService>;
    let toastService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                ChangePathwayCoordinator,
                {
                    provide: ModalService,
                    useValue: {
                        create: () => {},
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: val => val,
                        fromParams: (val, params) =>
                            `${val} ${params.join(' ')}`,
                    },
                },
                {
                    provide: PatientService,
                    useValue: {
                        changePathway: of({}),
                    },
                },
                {
                    provide: ToastService,
                    useValue: {
                        show: jasmine.createSpy('show'),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(ChangePathwayCoordinator);
        modalService = TestBed.get(ModalService);
        patientService = TestBed.get(PatientService);
        toastService = TestBed.get(ToastService);
    });

    describe('start()', () => {
        let patient: PatientOverview;
        beforeEach(() => {
            patient = TestPatientOverview.build();
            service.start(patient);
        });
        it('should start with patient', () =>
            expect(service.patient).toEqual(patient));
        it('should initialize state', () => {
            expect(service.state.value).toEqual({
                nextCareModule: null,
                previousCareModule: patient.careModule,
                mdtHcps: MdtsHcps.fromMDts(patient.patient.mdts),
                surgery: cloneDeep(patient.patient.surgery),
                isSubmitting: false,
            });
        });
    });

    describe('saveCareModuleId()', () => {
        it('should save care module', () => {
            const careModule = TestCareModules.build('1');
            service.start(TestPatientOverview.build());
            service.saveCareModule(careModule);
            expect(service.state.value.nextCareModule).toEqual(careModule);
        });
        it('should emit go to surgery', done => {
            const careModule = TestCareModules.build('1');
            service.goToEditSurgery.subscribe(done);
            service.start(TestPatientOverview.build());
            service.saveCareModule(careModule);
        });
    });

    describe('saveSurgery()', () => {
        it('should emit go to edit mdt', done => {
            const patient = TestPatientOverview.build();
            service.goToEditMdt.subscribe(done);
            service.start(patient);
            service.saveSurgery(patient.patient.surgery);
        });
    });

    describe('confirmChanges()', () => {
        let mockComponent;
        beforeEach(() => {
            service.start(TestPatientOverview.build());
            service.saveCareModule(TestCareModules.build());
            const spy = spyOn(modalService, 'create');
            mockComponent = {
                title: '',
                subtitle: '',
                onSuccess: new EventEmitter(),
                open: () => {},
            };
            spy.and.returnValue(mockComponent);
        });
        it('should create PasswordRequiredDialogComponent', done => {
            mockComponent.open = done;
            service.confirmChanges();
        });
        it('should set the title ', done => {
            mockComponent.open = done;
            service.confirmChanges();
            expect(mockComponent.title).toBe(
                `changePathwayConfirmationTitle ${
                    service.state.value.previousCareModule.title
                } ${service.state.value.nextCareModule.title}`,
            );
        });
        it('should set the subtitle ', done => {
            mockComponent.open = done;
            service.confirmChanges();
            expect(mockComponent.subtitle).toBe(
                'changePathwayConfirmationSubTitle',
            );
        });
        it('should call change pathway on confirmation', done => {
            mockComponent.open = done;
            const changePathway = spyOnSubscription(
                patientService,
                'changePathway',
                of({}),
            );
            service.confirmChanges();
            mockComponent.onSuccess.next();
            expect(changePathway.subscribe).toHaveBeenCalled();
        });
        it('should emit exit on success', done => {
            spyOn(patientService, 'changePathway').and.returnValue(of({}));
            service.exit.subscribe(done);
            service.confirmChanges();
            mockComponent.onSuccess.next();
        });
        it('should show success message', () => {
            spyOn(patientService, 'changePathway').and.returnValue(of({}));
            service.confirmChanges();
            mockComponent.onSuccess.next();
            expect(toastService.show).toHaveBeenCalledWith(
                null,
                `changePathwaySuccessMessage ${
                    service.state.value.previousCareModule.title
                } ${service.state.value.nextCareModule.title} ${
                    service.patient.patient.fullName
                }`,
            );
        });
        it('should set error state on failure', () => {
            spyOn(patientService, 'changePathway').and.returnValue(
                throwError({}),
            );
            service.confirmChanges();
            mockComponent.onSuccess.next();
            expect(service.state.value.isSubmitting).toBe(false);
            expect(service.state.value.error).toBe('unknownError');
        });
    });
});
