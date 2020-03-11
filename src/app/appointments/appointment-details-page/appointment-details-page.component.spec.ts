import {
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync,
} from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;

import { AppointmentDetailsPageComponent } from './appointment-details-page.component';
import { By } from '@angular/platform-browser';
import { AppointmentsService } from '../appointments.service';
import { TestAppointments } from 'test/support/test-appointments';
import { TestDateRanges } from 'test/support/test-date-ranges';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

describe('AppointmentDetailsPageComponent', () => {
    let fixture: ComponentFixture<AppointmentDetailsPageComponent>;
    let page: PageObject;
    let appointmentsService: SpyObj<AppointmentsService>;
    const mockAppointment = TestAppointments.build({
        timeSlot: TestDateRanges.createThisTimeTomorrow(),
    });
    class PageObject {
        get page() {
            return fixture.debugElement.query(By.css('page-container'));
        }

        get appointmentDetails() {
            return fixture.debugElement.query(By.css('appointment-details'));
        }
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [AppointmentDetailsPageComponent],
            providers: [
                LocaliseService,
                {
                    provide: AppointmentsService,
                    useValue: jasmine.createSpyObj('appointmentsService', [
                        'fetchAppointment',
                        'getAppointments$',
                        'updateAppointment',
                        'deleteAppointment',
                    ]),
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(
                            convertToParamMap({
                                id: mockAppointment.id,
                            }),
                        ),
                    },
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigateByUrl']),
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentDetailsPageComponent);
        appointmentsService = TestBed.get(AppointmentsService);
        page = new PageObject();
    });

    beforeEach(fakeAsync(() => {
        appointmentsService.fetchAppointment.and.returnValue(of());
        appointmentsService.getAppointments$.and.returnValue(
            new BehaviorSubject({
                list: [mockAppointment],
                isFetching: false,
            }),
        );
        appointmentsService.deleteAppointment.and.returnValue(
            Promise.resolve({}),
        );
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }));

    afterEach(() => {
        appointmentsService.deleteAppointment.calls.reset();
    });

    it('should be a page', () => {
        expect(page.page).toBeTruthy();
    });
});
