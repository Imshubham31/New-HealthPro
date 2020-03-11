import { ComponentFixture } from '@angular/core/testing';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { Patient } from '../../patient.model';
import { AddPatientPersonalDetailsComponent } from './add-patient-personal-details.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { SharedModule } from '@lib/shared/shared.module';
import { IntegratedPersonalDetailsComponent } from './integrated-personal-details.component';
import { of } from 'rxjs';

describe('IntegratedPersonalDetailsComponent', () => {
    let comp: AddPatientPersonalDetailsComponent;
    let fixture: ComponentFixture<AddPatientPersonalDetailsComponent>;
    const mockCoordinator = {
        patient: new Patient(),
        savePersonalDetails: () => of({}),
    };
    mockCoordinator.patient.integrated = { mrn: '' };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                ReactiveFormsModule,
                LocaliseModule,
                NzDatePickerModule,
            ],
            declarations: [IntegratedPersonalDetailsComponent],
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
        fixture = TestBed.createComponent(IntegratedPersonalDetailsComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not submit if invalid', () => {
        const spy = spyOn(
            mockCoordinator,
            'savePersonalDetails',
        ).and.returnValue({ message: 'success' });
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should submit if valid', () => {
        const testService = TestBed.get(AddPatientCoordinator);
        const spy = spyOn(testService, 'savePersonalDetails').and.returnValue(
            of({}),
        );
        comp.form.get('mrn').setValue('12345678');
        comp.form.get('lastName').setValue('testname');
        comp.form.get('email').setValue('test@test.com');
        comp.form.get('phone').setValue(1);
        comp.form.get('language').setValue('en');
        comp.submit();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(comp.shouldDisableSubmit()).toBeTruthy();
    });
});
