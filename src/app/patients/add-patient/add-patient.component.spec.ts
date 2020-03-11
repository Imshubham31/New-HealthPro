import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { Subject, of } from 'rxjs';

import { TestPatients } from '../../../test/support/test-patients';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AddPatientCoordinator } from './add-patient-coordinator.service';
import { AddPatientComponent } from './add-patient.component';
import { CareModuleComponent } from './care-module/care-module.component';
import { CareModulesService } from './care-module/caremodules.service';
import { SurgeryDetailsComponent } from './surgery-details/surgery-details.component';
import { SharedModule } from '@lib/shared/shared.module';
import { ComponentsFactory } from '@lib/shared/services/components.factory';
import { IntegratedPersonalDetailsComponent } from './personal-details/integrated-personal-details.component';
import { HospitalType } from '@lib/hospitals/hospital.model';

describe('AddPatientComponent', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                SharedModule,
                ReactiveFormsModule,
                LocaliseModule,
                NzDatePickerModule,
            ],
            declarations: [
                AddPatientComponent,
                IntegratedPersonalDetailsComponent,
                CareModuleComponent,
                SurgeryDetailsComponent,
            ],
            providers: [
                {
                    provide: AddPatientCoordinator,
                    useValue: {
                        errors: [],
                        onComplete$: new Subject(),
                        onCancel$: new Subject(),
                        reset: () => {},
                        getTitle: () => '',
                        getSubtitle: () => '',
                    },
                },
                CareModulesService,
                HospitalsRestService,
                {
                    provide: HospitalService,
                    useValue: {
                        hospital: of({ integrated: true }),
                    },
                },
                {
                    provide: ComponentsFactory,
                    useValue: {
                        make: type => type,
                    },
                },
            ],
        });
    });

    it('should start and open modal', () => {
        const addPatientComponent = TestBed.createComponent(AddPatientComponent)
            .componentInstance;
        addPatientComponent.open();
        expect(addPatientComponent.modal.modalActive).toBeTruthy();
    });

    it('should finish and close modal', () => {
        const addPatientComponent = TestBed.createComponent(AddPatientComponent)
            .componentInstance;
        addPatientComponent.close();
        expect(addPatientComponent.modal.modalActive).toBeFalsy();
    });

    it('should handle onComplete', () => {
        const addPatientComponent = TestBed.createComponent(AddPatientComponent)
            .componentInstance;
        addPatientComponent.addPatientCoordinator.onComplete$.next({
            patient: TestPatients.createEvaGriffiths(),
        });
        expect(addPatientComponent.modal.modalActive).toBeFalsy();
    });
    it('should set addPersonalDetailsComponent integrated', () => {
        const addPatientComponent = TestBed.createComponent(AddPatientComponent)
            .componentInstance;
        addPatientComponent.ngOnInit();
        expect(addPatientComponent.addPersonalDetailsComponent).toEqual(
            HospitalType.Integrated,
        );
    });
    it('should set addPersonalDetailsComponent non-integrated', () => {
        const addPatientComponent = TestBed.createComponent(AddPatientComponent)
            .componentInstance;
        TestBed.get(HospitalService).hospital = of({ integrated: false });
        addPatientComponent.ngOnInit();
        expect(addPatientComponent.addPersonalDetailsComponent).toEqual(
            HospitalType.NonIntegrated,
        );
    });
});
