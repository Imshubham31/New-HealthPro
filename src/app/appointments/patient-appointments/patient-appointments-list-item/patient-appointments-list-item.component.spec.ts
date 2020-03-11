import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestAppointments } from 'test/support/test-appointments';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Localise } from '@lib/localise/localise.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { AppointmentStatus } from '@lib/appointments/appointment-status.enum';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { SharedModule } from '@lib/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientAppointmentsListItemComponent } from './patient-appointments-list-item.component';

describe('PatientAppointmentsListItemComponent', () => {
    let component: PatientAppointmentsListItemComponent;
    let fixture: ComponentFixture<PatientAppointmentsListItemComponent>;
    let page: PageObject;
    let localize: LocaliseService;

    let datePipe: LocalisedDatePipe;
    class PageObject {
        get time(): string {
            return fixture.debugElement
                .query(By.css('.time'))
                .nativeElement.textContent.trim();
        }

        get title(): string {
            return fixture.debugElement
                .query(By.css('.title'))
                .nativeElement.textContent.trim();
        }

        get status(): DebugElement {
            return fixture.debugElement.query(By.css('appointment-status'));
        }

        get HCPs(): Array<DebugElement> {
            return fixture.debugElement.queryAll(By.css('.HCP'));
        }
    }

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, SharedModule, HttpClientTestingModule],
            declarations: [PatientAppointmentsListItemComponent],
            providers: [Localise],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientAppointmentsListItemComponent);
        component = fixture.componentInstance;
        component.appointment = TestAppointments.createDietFollowUp();

        localize = TestBed.get(LocaliseService);
        localize.use('en');
        datePipe = new LocalisedDatePipe(localize);

        page = new PageObject();
        fixture.detectChanges();
    });

    it('should show the appointment start time in the 24 hrs format', () => {
        expect(page.time).toEqual(
            datePipe.transform(component.appointment.timeSlot.start, 'HH:mm'),
        );
    });

    it('should show the appointment title', () => {
        expect(page.title).toEqual(component.appointment.title);
    });

    it('should show the appointment status', () => {
        expect(page.status.properties.status).toEqual(
            component.appointment.status,
        );
    });

    describe('appointment status text', () => {
        describe('when appointment is pending', () => {
            beforeEach(() => {
                component.appointment.status = AppointmentStatus.pending;
                fixture.detectChanges();
            });

            it('should show the user acceptance pending text', () => {
                expect(page.status.properties.text).toEqual(
                    localize.fromKey('appointmentAwaitingPatientResponse'),
                );
            });
        });

        describe('when appointment is accepted', () => {
            beforeEach(() => {
                component.appointment.status = AppointmentStatus.accepted;
                fixture.detectChanges();
            });

            it('should show the user acceptance pending text', () => {
                expect(page.status.properties.text).toEqual(
                    localize.fromKey('appointmentAcceptedByPatient'),
                );
            });
        });

        describe('when appointment is declined', () => {
            beforeEach(() => {
                component.appointment.status = AppointmentStatus.declined;
                fixture.detectChanges();
            });

            it('should show the user acceptance pending text', () => {
                expect(page.status.properties.text).toEqual(
                    localize.fromKey('appointmentDeclinedByPatient'),
                );
            });
        });
    });

    it('should show the list of HCPs', () => {
        expect(page.HCPs).toBeTruthy();
    });

    describe('HCP list', () => {
        const findHCPInDom = HCP =>
            page.HCPs.find(
                HCPInDom =>
                    HCPInDom.attributes['data-tooltip'] ===
                    `${HCP.firstName} ${HCP.lastName}`,
            );

        it('should show every HCPs profile picture', done => {
            component.appointment.watcherDetails.forEach(watcher => {
                const image = findHCPInDom(watcher).query(By.css('img'));
                expect(image).toBeTruthy();
                expect(image.properties.src).toEqual('/assets/Avatar.svg');
                done();
            });
        });
    });
});
