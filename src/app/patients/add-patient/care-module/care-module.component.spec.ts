import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CareModuleComponent } from './care-module.component';
import { CareModulesService } from 'app/patients/add-patient/care-module/caremodules.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { ModalFormControlComponent } from '@lib/shared/components/modal/form-control/form-control.component';

@Component({
    selector: 'care-module-selection',
    template: `
        <p>care-module-selection</p>
    `,
})
class MockCareModuleSelectionComponent {}

describe('CareModuleComponent', () => {
    let comp: CareModuleComponent;
    let fixture: ComponentFixture<CareModuleComponent>;
    const mockCoordinator = {
        patient: {
            id: 1,
            firstName: 'Test subject',
            lastName: 'tester',
            fullName: 'The tester',
            nickname: 'Some',
            email: 'some@email.com',
            phoneNumber: 1334567,
            profilePictureUri: '',
            optOut: '',
            optOutDatetime: '274655',
            gender: 'M',
            careModuleId: '1',
            consent: true,
            dob: new Date(),
        },
        saveCareModules: (careModule: string) => {},
        clearCareModule: () => {},
    };

    let service: jasmine.SpyObj<CareModulesService>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, LocaliseModule, HttpClientModule],
            declarations: [
                CareModuleComponent,
                MockCareModuleSelectionComponent,
                ModalFormControlComponent,
            ],
            providers: [
                { provide: AddPatientCoordinator, useValue: mockCoordinator },
                {
                    provide: CareModulesService,
                    useValue: jasmine.createSpyObj('careModulesService', [
                        'fetchCareModules$',
                        'getCareModules$',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(CareModulesService);
        service.fetchCareModules$.and.returnValue(of([]));
        service.getCareModules$.and.returnValue(of([]));
        fixture = TestBed.createComponent(CareModuleComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be defined', () => {
        expect(comp).toBeTruthy();
    });

    it('should not submit if invalid', () => {
        const spy = spyOn(mockCoordinator, 'saveCareModules');
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should submit if valid', () => {
        const testService = TestBed.get(AddPatientCoordinator);
        const spy = spyOn(testService, 'saveCareModules');
        comp.form.get('modules').setValue('1');
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(comp.shouldDisableSubmit()).toBeTruthy();
    });

    it('should previous', done => {
        const spy = spyOn(
            TestBed.get(AddPatientCoordinator),
            'clearCareModule',
        );

        comp.onCancel.subscribe(() => {
            expect(comp.form.valid).toBeFalsy();
            expect(spy).toHaveBeenCalled();
            done();
        });
        comp.previous();
    });
});
