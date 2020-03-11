import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { CareModulesService } from '../add-patient/care-module/caremodules.service';
import { TestBed } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';
import { EditCareModuleComponent } from './edit-care-module.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { of, BehaviorSubject } from 'rxjs';
import { TestCareModules } from 'test/support/test-caremodules';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { Input, Component } from '@angular/core';
import { ModalFormControlComponent } from '@lib/shared/components/modal/form-control/form-control.component';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'care-module-selection',
    template: `
        <div *ngFor="let id of excludeIds" id="id{{ id }}"></div>
    `,
})
class MockCareModuleSelectionComponent {
    @Input() excludeIds: string[] = [];
}
describe('EditCareModuleComponent', () => {
    let component;
    let fixture;
    let careModulesService: jasmine.SpyObj<CareModulesService>;
    let changePathwayCoordinator;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: val => val,
                    },
                },
                {
                    provide: CareModulesService,
                    useValue: jasmine.createSpyObj('careModulesService', [
                        'fetchCareModules$',
                        'getCareModules$',
                    ]),
                },
                {
                    provide: ChangePathwayCoordinator,
                    useValue: {
                        state: new BehaviorSubject({
                            careModuleId: null,
                            mdt: null,
                            surgery: null,
                        }),
                        saveCareModule: () => {},
                        patient: TestPatientOverview.build(),
                    },
                },
            ],
            declarations: [
                EditCareModuleComponent,
                MockLocalisePipe,
                MockCareModuleSelectionComponent,
                ModalFormControlComponent,
            ],
        });
    });

    beforeEach(() => {
        careModulesService = TestBed.get(CareModulesService);
        changePathwayCoordinator = TestBed.get(ChangePathwayCoordinator);
        careModulesService.fetchCareModules$.and.returnValue(
            of([TestCareModules.build('1'), TestCareModules.build('2')]),
        );
        fixture = TestBed.createComponent(EditCareModuleComponent);
        component = fixture.componentInstance;
    });
    describe('title', () => {
        it('should have the title editCareModule', () => {
            expect(component.title).toBe('editCareModule');
        });
    });
    describe('submitText', () => {
        it('should have the submitText nextSurgeryProcedureInformation', () => {
            expect(component.submitText).toBe(
                'nextSurgeryProcedureInformation',
            );
        });
    });
    describe('setupForm', () => {
        it('should have modules form control', () => {
            expect(component.form.get('modules')).toBeDefined();
        });
    });
    describe('submit', () => {
        it('should save caremodule', () => {
            const spy = spyOn(changePathwayCoordinator, 'saveCareModule');
            const careModule = TestCareModules.build('1');
            component.form.get('modules').setValue(careModule);
            component.submit();
            expect(spy).toHaveBeenCalledWith(careModule);
        });
    });

    describe('care-modules-selection comp', () => {
        it('should exclude by patient care modules id', () => {
            const patient = TestPatientOverview.build();
            fixture.detectChanges();
            expect(
                fixture.debugElement.query(
                    By.css(`#id${patient.careModule.id}`),
                ),
            ).not.toBeNull();
        });
    });
});
