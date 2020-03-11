import { By } from '@angular/platform-browser';
import { PathWayService } from '@lib/pathway/pathway.service';
import { PatientCardComponent } from './patient-card.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TestPatients } from 'test/support/test-patients';
import { TestPathways } from 'test/support/test-pathways';

let component: PatientCardComponent;
let fixture: ComponentFixture<PatientCardComponent>;

function setupTestBed(pathway?, showDetailsButton?) {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [PatientCardComponent],
        providers: [
            {
                provide: PathWayService,
                useValue: {
                    getPathwayById$: () => of(pathway),
                },
            },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PatientCardComponent);
    component = fixture.componentInstance;
    component.patient = {
        patient: TestPatients.createEvaGriffiths(),
        careModule: null,
    };
    component.pathway = pathway;
    component.showDetailsButton = showDetailsButton;
    fixture.detectChanges();
}

describe('Patient Card Component', () => {
    it('should show loading pathway if pathway is loading', () => {
        setupTestBed();
        expect(fixture.debugElement.queryAll(By.css('.loading')).length).toBe(
            1,
        );
    });
    it('should show pathway task and goal progress', () => {
        const pathway = TestPathways.build();
        setupTestBed(pathway);
        expect(fixture.debugElement.queryAll(By.css('.loading')).length).toBe(
            0,
        );
        expect(
            fixture.debugElement.queryAll(By.css('task-progress')).length,
        ).toBe(1);
        expect(
            fixture.debugElement.queryAll(By.css('goal-progress')).length,
        ).toBe(1);
    });
    it('should show detals button when needed', () => {
        const pathway = TestPathways.build();
        setupTestBed(pathway, true);
        expect(fixture.debugElement.queryAll(By.css('.loading')).length).toBe(
            0,
        );
        expect(
            fixture.debugElement.queryAll(By.css('.details-button')).length,
        ).toBe(1);
    });
});
