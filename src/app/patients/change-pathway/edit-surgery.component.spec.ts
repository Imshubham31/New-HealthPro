import { SurgeonsService } from '../add-patient/surgery-details/surgeons.service';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { ChangePathwayCoordinator } from './change-pathway-coordinator';
import { EditSurgeryComponent } from './edit-surgery.component';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LocaliseService } from '@lib/localise/localise.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Surgeon } from '../add-patient/surgery-details/surgeon.model';
import { Stores } from '@lib/utils/stores';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Surgery } from '../surgery.model';
import { ModalFormControlComponent } from '@lib/shared/components/modal/form-control/form-control.component';
import { TestSurgeons } from 'test/support/test-surgeons';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditSurgeryComponent', () => {
    let component;
    let fixture;
    let changePathwayCoordinator;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, LocaliseModule],
            providers: [
                {
                    provide: LocaliseService,
                    useValue: {
                        fromKey: val => val,
                        getDateFormat: date => date,
                        getLocale: locale => locale,
                    },
                },
                {
                    provide: SurgeonsService,
                    useValue: {
                        store$: new Stores.StoreFactory<Surgeon>().make(),
                    },
                },
                {
                    provide: ChangePathwayCoordinator,
                    useValue: {
                        state: new BehaviorSubject({
                            careModuleId: null,
                            mdt: null,
                            surgery: null,
                        }),
                        saveSurgery: () => {},
                        patient: TestPatientOverview.build(),
                    },
                },
            ],
            declarations: [
                EditSurgeryComponent,
                MockLocalisePipe,
                ModalFormControlComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        changePathwayCoordinator = TestBed.get(ChangePathwayCoordinator);
        fixture = TestBed.createComponent(EditSurgeryComponent);
        component = fixture.componentInstance;
    });

    describe('title', () => {
        it('has the title surgeryInformation', () => {
            expect(component.title).toBe('surgeryInformation');
        });
    });

    describe('setupForm', () => {
        it('should have the surgery form control', () => {
            expect(component.form.get('surgery')).toBeDefined();
        });
    });

    describe('submit', () => {
        it('should save surgery date and surgeon id', () => {
            const spy = spyOn(changePathwayCoordinator, 'saveSurgery');
            const updatedSurgery = new Surgery();
            updatedSurgery.surgeon = TestSurgeons.build('3');
            updatedSurgery.startDateTime = new Date(2022, 3, 1);
            component.form.get('surgery').setValue(updatedSurgery);
            component.submit();
            expect(spy).toHaveBeenCalledWith(updatedSurgery);
        });
    });
});
