import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocaliseService } from './../../../lib/localise/localise.service';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { ChangePathwayComponent } from './change-pathway.component';
import { PageObject } from 'test/support/page-object';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { ChangePathwayStage } from './change-pathway-stage';
import { NgxdModule } from '@ngxd/core';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { EventEmitter } from '@angular/core';
import { spyOnSubscription } from 'test/support/custom-spies';
import { of } from 'rxjs';
import { EditCareModuleComponent } from './edit-care-module.component';
import { EditSurgeryComponent } from './edit-surgery.component';

xdescribe('ChangePathwayComponent', () => {
    class ChangePathwayComponentPageObject extends PageObject<
        ChangePathwayComponent
    > {
        get title() {
            return this.fixture.debugElement.query(By.css('#modal-title'));
        }
        get subTitle() {
            return this.fixture.debugElement.query(By.css('#modal-subtitle'));
        }
    }
    class MockStage implements ChangePathwayStage {
        title = 'test';
        submitText = 'save';
    }
    let page: ChangePathwayComponentPageObject;
    let changePathwayCoordinator: ChangePathwayCoordinator;
    let startSpy;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [NgxdModule],
            providers: [
                {
                    provide: ChangePathwayCoordinator,
                    useValue: {
                        state: new BehaviorSubject({}),
                        patient: TestPatientOverview.build(),
                        start: () => {},
                        goToEditCareModule: new EventEmitter(),
                        goToEditSurgery: new EventEmitter(),
                        goToEditMdt: new EventEmitter(),
                        exit: new EventEmitter(),
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: val => val,
                    },
                },
            ],
            declarations: [ChangePathwayComponent, ModalWrapperComponent],
        });
    });

    beforeEach(() => {
        page = new ChangePathwayComponentPageObject(
            TestBed.createComponent(ChangePathwayComponent),
        );
        changePathwayCoordinator = TestBed.get(ChangePathwayCoordinator);
        startSpy = spyOn(changePathwayCoordinator, 'start');
    });

    afterEach(() => startSpy.calls.reset());

    describe('onActivate(componentInstance: ChangePathwayStage)', () => {
        it('should set the title', () => {
            const stage = new MockStage();
            changePathwayCoordinator.start(TestPatientOverview.build());
            page.component.onActivate(stage);
            page.fixture.detectChanges();
            expect(page.title.nativeElement.innerHTML).toBe(stage.title);
        });
    });

    describe('subTitle', () => {
        it('should have the patients name as subtitle', () => {
            const patient = TestPatientOverview.build();
            const stage = new MockStage();
            changePathwayCoordinator.start(patient);
            page.component.onActivate(stage);
            page.fixture.detectChanges();
            expect(page.subTitle.nativeElement.innerHTML).toBe(
                `forPatient ${patient.patient.firstName} ${
                    patient.patient.lastName
                }`,
            );
        });
    });

    describe('openWithPatient(patient: PatientOverview)', () => {
        it('should start the coordinator with patient', () => {
            const patient = TestPatientOverview.build();
            page.component.openWithPatient(patient);
            expect(startSpy).toHaveBeenCalledWith(patient);
        });

        [
            'goToEditCareModule',
            'goToEditSurgery',
            'goToEditMdt',
            'exit',
        ].forEach(event => {
            it(`should subscribe to ${event}`, () => {
                const spy = spyOnSubscription(
                    changePathwayCoordinator,
                    event,
                    of({}),
                );
                const patient = TestPatientOverview.build();
                page.component.openWithPatient(patient);
                expect(spy.subscribe).toHaveBeenCalled();
            });
        });
    });

    describe('open()', () => {
        it('should open the modal', () => {
            const spy = spyOn(page.component.modal, 'openModal');
            page.component.open();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('close(result?: any)', () => {
        it('should close the modal', () => {
            const spy = spyOn(page.component.modal, 'closeModal');
            page.component.close();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('goToEditCareModule', () => {
        it('should load EditCareModuleComponent', () => {
            const patient = TestPatientOverview.build();
            page.component.openWithPatient(patient);
            changePathwayCoordinator.goToEditCareModule.emit();
            expect(page.component.component.name).toBe(
                EditCareModuleComponent.name,
            );
        });
    });

    describe('goToEditSurgery', () => {
        it('should load EditSurgeryComponent', () => {
            const patient = TestPatientOverview.build();
            page.component.openWithPatient(patient);
            changePathwayCoordinator.goToEditSurgery.emit();
            expect(page.component.component.name).toBe(
                EditSurgeryComponent.name,
            );
        });
    });
});
