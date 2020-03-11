import { SurgeonsService } from 'app/patients/add-patient/surgery-details/surgeons.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { SurgerySelectionComponent } from './surgery-selection.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Service } from '../service';
import { of, BehaviorSubject } from 'rxjs';
import { spyOnSubscription } from 'test/support/custom-spies';
import { TestSurgeons } from 'test/support/test-surgeons';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModalComponentsModule } from '../modal.module';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SurgerySelectionComponent', () => {
    let component: SurgerySelectionComponent;
    let fixture: ComponentFixture<SurgerySelectionComponent>;
    let surgeonsService: jasmine.SpyObj<SurgeonsService>;
    let hospitalService: jasmine.SpyObj<HospitalService>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                LocaliseModule,
                ReactiveFormsModule,
                SharedModalComponentsModule,
            ],
            declarations: [SurgerySelectionComponent],
            providers: [
                {
                    provide: Service,
                    useValue: {
                        getValue: () => of(null),
                        setValidationErrors: () => {},
                        onChange: () => of(null),
                    },
                },
                {
                    provide: LocaliseService,
                },
                {
                    provide: SurgeonsService,
                    useValue: {
                        store$: new BehaviorSubject<any>({
                            list: [
                                TestSurgeons.build('1'),
                                TestSurgeons.build('2'),
                            ],
                        }),
                        getSurgeons$: () => of([]),
                    },
                },
                {
                    provide: HospitalService,
                    useValue: {
                        fetchHospital: () => of({}),
                    },
                },
                RestrictProcessingPipe,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        surgeonsService = TestBed.get(SurgeonsService);
        hospitalService = TestBed.get(HospitalService);
        fixture = TestBed.createComponent(SurgerySelectionComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should fetch surgeons and the hospital', () => {
            const surgeonSpy = spyOnSubscription(
                surgeonsService,
                'getSurgeons$',
                of([]),
            );
            const hospitalSpy = spyOnSubscription(
                hospitalService,
                'fetchHospital',
                of({}),
            );
            const storeSpy = spyOnSubscription(
                surgeonsService,
                'store$',
                of({}),
            );
            component.ngOnInit();
            expect(surgeonSpy.subscribe).toHaveBeenCalledTimes(1);
            expect(hospitalSpy.subscribe).toHaveBeenCalledTimes(1);
            expect(storeSpy.subscribe).toHaveBeenCalledTimes(1);
        });
        it('should get the store', () => {
            const spy = spyOnSubscription(surgeonsService, 'store$', of([]));
            component.ngOnInit();
            expect(spy.subscribe).toHaveBeenCalledTimes(1);
        });
        it('should disable the surgeon field if the store is being fetched', () => {
            surgeonsService.store$.next({ isFetching: true, list: [] });
            component.ngOnInit();
            expect(component.group.get('surgeon').disabled).toBe(true);
        });
        it('should enable the surgeon field if the store is done or not being fetched', () => {
            surgeonsService.store$.next({ isFetching: false, list: [] });
            component.ngOnInit();
            expect(component.group.get('surgeon').disabled).toBe(false);
        });
        it('should set value', () => {
            component.ngOnInit();
            component.group.setValue({
                surgeon: TestSurgeons.build('2'),
                startDateTime: new Date(),
            });
            component.group.valueChanges.subscribe();
            expect(component.group.value.surgeon).toEqual(
                TestSurgeons.build('2'),
            );
        });
    });
});
