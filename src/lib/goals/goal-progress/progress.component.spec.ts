import { TestPathways } from 'test/support/test-pathways';
import { ProgressComponent } from '@lib/goals/goal-progress/progress.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { UnitsUtils } from '@lib/utils/units-utils';
import { TestPatients } from 'test/support/test-patients';

let component: ProgressComponent;
let fixture: ComponentFixture<ProgressComponent>;

describe('Progress Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ProgressComponent],
            providers: [UnitsUtils],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(ProgressComponent);
        component = fixture.componentInstance;
        component.patient = TestPatients.createEvaGriffiths();
        component.pathway = TestPathways.build();
        fixture.detectChanges();
    });
    it('should fatch values on change', () => {
        const spy = spyOn(component, 'fetchValue');
        component.ngOnChanges({ pathway: null });
        expect(spy).not.toHaveBeenCalled();
        component.ngOnChanges({ pathway: new SimpleChange(0, 1, false) });
        expect(spy).toHaveBeenCalled();
    });
});
