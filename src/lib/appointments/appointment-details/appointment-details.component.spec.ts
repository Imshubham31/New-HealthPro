import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppointmentDetailsComponent } from './appointment-details.component';
import { TestAppointments } from '../../../test/support/test-appointments';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from '@lib/localise/languages';
import { SharedModule } from '@lib/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxdModule } from '@ngxd/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AppointmentsService } from 'app/appointments/appointments.service';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IntegratedAppointmentDetailsComponent } from './integrated/integrated-appointment-details.component';
import { IntegratedAppointmentDetailsActionsComponent } from './integrated/integrated-appointment-details-actions.component';
import { NonIntegratedAppointmentDetailsComponent } from './non-integrated/non-integrated-appointment-details.component';
import { NonIntegratedAppointmentDetailsActionsComponent } from './non-integrated/non-integrated-appointment-details-actions.component';
import { MockAppointmentFormFactory } from 'app/appointments/appointment-form/factories/mock-appointment-form.factory';

xdescribe('AppointmentDetailsComponent', () => {
    let component: AppointmentDetailsComponent;
    let fixture: ComponentFixture<AppointmentDetailsComponent>;
    let service: jasmine.SpyObj<AppointmentsService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                LocaliseModule,
                SharedModule,
                HttpClientTestingModule,
                NgxdModule,
            ],
            declarations: [
                AppointmentDetailsComponent,
                IntegratedAppointmentDetailsComponent,
                IntegratedAppointmentDetailsActionsComponent,
                NonIntegratedAppointmentDetailsComponent,
                NonIntegratedAppointmentDetailsActionsComponent,
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                LocaliseService,
                LANGUAGE_PROVIDERS,
                HttpClient,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: new BehaviorSubject({ id: '1' }),
                    },
                },
                {
                    provide: AppointmentsService,
                    useValue: jasmine.createSpyObj('appointmentService', [
                        'getAppointments$',
                        'getAppointment$',
                    ]),
                },
                MockAppointmentFormFactory.buildProvider(),
            ],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    IntegratedAppointmentDetailsComponent,
                    NonIntegratedAppointmentDetailsComponent,
                    NonIntegratedAppointmentDetailsActionsComponent,
                    IntegratedAppointmentDetailsActionsComponent,
                ],
            },
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentDetailsComponent);
        component = fixture.componentInstance;
        service = TestBed.get(AppointmentsService);
    });

    describe('integrated appointments', () => {
        it('should use integrated details components', () => {
            setup(true);
            expect(component.component.name).toBe(
                IntegratedAppointmentDetailsComponent.name,
            );
        });
    });

    describe('non-integrated appointments', () => {
        it('should use non-integrated details components', () => {
            setup(false);
            expect(component.component.name).toBe(
                NonIntegratedAppointmentDetailsComponent.name,
            );
        });
    });

    function setup(integrated) {
        const appointment = TestAppointments.createDietFollowUp();
        service.getAppointments$.and.returnValue(of({ list: [appointment] }));
        service.getAppointment$.and.returnValue(of(appointment));
        appointment.isIntegrated = integrated;
        component.ngOnInit();
    }
});
