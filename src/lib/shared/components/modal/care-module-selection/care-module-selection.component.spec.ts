import { CareModulesService } from './../../../../../app/patients/add-patient/care-module/caremodules.service';
import { CareModuleSelectionComponent } from './care-module-selection.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Service } from '../service';
import { of } from 'rxjs';
import { spyOnSubscription } from 'test/support/custom-spies';
import { TestCareModules } from 'test/support/test-caremodules';

describe('CareModuleSelectionComponent', () => {
    let component: CareModuleSelectionComponent;
    let fixture: ComponentFixture<CareModuleSelectionComponent>;
    let careModulesService: jasmine.SpyObj<CareModulesService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CareModuleSelectionComponent],
            providers: [
                {
                    provide: Service,
                    useValue: {
                        getValue: () => of(null),
                        onChange: () => of(null),
                    },
                },
                {
                    provide: CareModulesService,
                    useValue: {
                        fetchCareModules$: () => of([]),
                        getCareModules$: () => of([]),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        careModulesService = TestBed.get(CareModulesService);
        fixture = TestBed.createComponent(CareModuleSelectionComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should fetchCareModules', () => {
            const spy = spyOnSubscription(
                careModulesService,
                'fetchCareModules$',
                of([]),
            );
            component.ngOnInit();
            expect(spy.subscribe).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCareModules$', () => {
        it('should display all care modules', () => {
            spyOn(careModulesService, 'getCareModules$').and.returnValue(
                of([TestCareModules.build('1'), TestCareModules.build('2')]),
            );
            component.getCareModules$().subscribe(careModules => {
                expect(careModules.length).toBe(2);
            });
        });
        it('should filter based on excludeIds', () => {
            spyOn(careModulesService, 'getCareModules$').and.returnValue(
                of([TestCareModules.build('1'), TestCareModules.build('2')]),
            );
            component.excludeIds = ['1'];
            component.getCareModules$().subscribe(careModules => {
                expect(careModules.length).toBe(1);
                expect(careModules[0].id).toBe('2');
            });
        });
    });

    describe('handleChange()', () => {
        it('should set value', () => {
            spyOn(careModulesService, 'getCareModules$').and.returnValue(
                of([TestCareModules.build('1'), TestCareModules.build('2')]),
            );
            component.handleChange({ target: { value: '1' } });
            expect(component.value).toEqual(TestCareModules.build('1'));
        });

        it('should trigger onChange', () => {
            spyOn(careModulesService, 'getCareModules$').and.returnValue(
                of([TestCareModules.build('1'), TestCareModules.build('2')]),
            );
            const changeSpy = spyOn(component.service, 'onChange');
            component.handleChange({ target: { value: '1' } });
            expect(changeSpy).toHaveBeenCalledWith(TestCareModules.build('1'));
        });

        it('should not trigger onChange if no match on value in store', () => {
            spyOn(careModulesService, 'getCareModules$').and.returnValue(
                of([]),
            );
            const changeSpy = spyOn(component.service, 'onChange');
            component.handleChange({ target: { value: 'x' } });
            expect(changeSpy).not.toHaveBeenCalled();
        });
    });
});
