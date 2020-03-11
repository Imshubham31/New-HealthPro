import { GDPR_CONSTANTS } from './hospital-gdpr.directive';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { HospitalGdprDirective } from '@lib/hospitals/hospital-gdpr.directive';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { TestBed, ComponentFixture, getTestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { Hospital } from './hospital.model';

@Component({
    template: `
        <div *gdpr="gdpr"></div>
    `,
})
class TestHospitalGdprDirectiveComponent {
    gdpr = '';
}

describe('HospitalGdprDirective', () => {
    const mockHospital: Hospital = {
        showExportMyData: true,
        showRightToBeForgotten: true,
        showRestrictToProcessData: true,
    };
    let fixture: ComponentFixture<TestHospitalGdprDirectiveComponent>;
    let injector: TestBed;
    let hospitalService: SpyObj<HospitalService>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestHospitalGdprDirectiveComponent,
                HospitalGdprDirective,
            ],
            providers: [
                {
                    provide: HospitalService,
                    useValue: jasmine.createSpyObj('hospitalService', [
                        'fetchHospital',
                    ]),
                },
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
        hospitalService = injector.get(HospitalService);
    });

    afterEach(() => hospitalService.fetchHospital.calls.reset());

    it('should show element', () => {
        hospitalService.fetchHospital.and.returnValue(
            of({ showExportMyData: true }),
        );
        fixture = TestBed.createComponent(TestHospitalGdprDirectiveComponent);
        fixture.componentInstance.gdpr = GDPR_CONSTANTS.EXPORT_MY_DATA;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(1);
    });

    it('should show restrict processing element', () => {
        hospitalService.fetchHospital.and.returnValue(
            of({ showRestrictToProcessData: true }),
        );
        fixture = TestBed.createComponent(TestHospitalGdprDirectiveComponent);
        fixture.componentInstance.gdpr =
            GDPR_CONSTANTS.RIGHT_TO_RESTRICT_PROCESSING_DATA;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(1);
    });

    it('should remove element', () => {
        hospitalService.fetchHospital.and.returnValue(
            of({ showExportMyData: false }),
        );
        fixture = TestBed.createComponent(TestHospitalGdprDirectiveComponent);
        fixture.componentInstance.gdpr = GDPR_CONSTANTS.EXPORT_MY_DATA;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(0);
    });
});
