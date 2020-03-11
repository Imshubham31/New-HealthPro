import { ComponentFixture } from '@angular/core/testing';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { Patient } from '../../patient.model';
import { LocaliseModule } from '@lib/localise/localise.module';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { SharedModule } from '@lib/shared/shared.module';
import { NonIntegratedPersonalDetailsComponent } from './non-integrated-personal-details.component';
import { of } from 'rxjs';

describe('NonIntegratedPersonalDetailsComponent', () => {
    let comp: NonIntegratedPersonalDetailsComponent;
    let fixture: ComponentFixture<NonIntegratedPersonalDetailsComponent>;
    let mockCoordinator;

    configureTestSuite(() => {
        mockCoordinator = {
            patient: new Patient(),
            savePersonalDetails: () => of({}),
        };
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                ReactiveFormsModule,
                LocaliseModule,
                NzDatePickerModule,
            ],
            declarations: [NonIntegratedPersonalDetailsComponent],
            providers: [
                { provide: AddPatientCoordinator, useValue: mockCoordinator },
                {
                    provide: HospitalService,
                    useValue: { hospital: of({}) },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(
            NonIntegratedPersonalDetailsComponent,
        );
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should not submit if invalid', () => {
        assertInvalid();
    });

    it('should submit if valid', () => {
        const testService = TestBed.get(AddPatientCoordinator);
        const spy = spyOn(testService, 'savePersonalDetails').and.returnValue(
            of({}),
        );
        buildValidInputs();
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(comp.shouldDisableSubmit()).toBeTruthy();
    });

    function buildValidInputs() {
        comp.form.get('firstName').setValue('testname');
        comp.form.get('lastName').setValue('testname');
        comp.form.get('gender').setValue('male');
        comp.form.get('dob').setValue(new Date());
        comp.form.get('email').setValue('test@test.com');
        comp.form.get('phone').setValue(1);
        comp.form.get('language').setValue('en');
    }

    function assertInvalid() {
        const spy = spyOn(
            mockCoordinator,
            'savePersonalDetails',
        ).and.returnValue({ message: 'success' });
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(0);
    }
});
