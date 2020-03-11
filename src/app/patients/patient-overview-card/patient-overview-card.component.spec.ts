import { ModalService } from './../../../lib/shared/components/modal/modal.service';
import { AgePipe } from '@lib/shared/services/age.pipe';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientOverviewCardComponent } from './patient-overview-card.component';
import { Component, Input } from '@angular/core';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CareModulesService } from '../add-patient/care-module/caremodules.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestCareModules } from 'test/support/test-caremodules';
import { of, BehaviorSubject } from 'rxjs';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { DatefunctionsPipe } from '@lib/shared/services/datefunctions.pipe';

@Component({
    selector: 'avatar-img',
    template: '<p>avatar-img</p>',
})
class MockNavigationBarComponent {
    @Input() user: any;
}
const mockCaremoduleService = {
    store$: new BehaviorSubject({
        list: [TestCareModules.build()],
        isFetching: false,
    }),
    getCareModules$: () => {
        return of([TestCareModules.build()]);
    },
    fetchCareModules$: () => {
        return of([TestCareModules.build()]);
    },
    getCareModuleCount: () => {
        return of(TestCareModules.length);
    },
};

describe('PatientOverviewCardComponent', () => {
    let component: PatientOverviewCardComponent;
    let fixture: ComponentFixture<PatientOverviewCardComponent>;
    const checkIfIntegratedSpy = jasmine.createSpy();
    const openWithPatientSpy = jasmine.createSpy();

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, HttpClientTestingModule],
            declarations: [
                PatientOverviewCardComponent,
                MockNavigationBarComponent,
                LocalisedDatePipe,
                AgePipe,
                RestrictProcessingPipe,
                DatefunctionsPipe,
            ],
            providers: [
                {
                    provide: ModalService,
                    useValue: {
                        create: () => ({
                            checkIfIntegrated: checkIfIntegratedSpy,
                            openWithPatient: openWithPatientSpy,
                        }),
                    },
                },
                {
                    provide: AuthenticationService,
                    useValue: {
                        isCareCoordinator: () => true,
                    },
                },
                {
                    provide: CareModulesService,
                    useValue: mockCaremoduleService,
                },
                HospitalsRestService,
                LocalisedDatePipe,
                AgePipe,
                RestrictProcessingPipe,
                DatefunctionsPipe,
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientOverviewCardComponent);
        component = fixture.componentInstance;
        component.patientOverviewData = TestPatientOverview.build();
        fixture.detectChanges();
    });
    it('should check if edit profile is available', () => {
        expect(component.shouldShowEditProfile).toBeFalsy();
    });
    it('should open edit modal', () => {
        component.editPatient();
        expect(checkIfIntegratedSpy).toHaveBeenCalled();
    });

    it('should open edit care module modal', () => {
        component.openEditCareModule();
        expect(openWithPatientSpy).toHaveBeenCalledWith(
            TestPatientOverview.build(),
        );
    });
});
