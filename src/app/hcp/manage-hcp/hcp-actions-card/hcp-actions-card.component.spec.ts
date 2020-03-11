import { TestBed } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';

import { Component, Input } from '../../../../../node_modules/@angular/core';
import { MockLocalisePipe } from './../../../../test/support/mock-localise.pipe';
import { TestHCPs } from './../../../../test/support/test-hcps';
import { HcpActionsCardComponentPage } from './hcp-action-card.page-object';
import { HcpActionsCardComponent } from './hcp-actions-card.component';
import { Observable } from 'rxjs/Observable';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { of } from 'rxjs';

import SpyObj = jasmine.SpyObj;
import { Hospital } from '@lib/hospitals/hospital.model';
import { MockAppointmentFormFactory } from 'app/appointments/appointment-form/factories/mock-appointment-form.factory';

@Component({
    selector: 'create-new-message',
    template: '<p>mock</p>',
})
class MockCreateNewMessageComponent {
    @Input() hcp;
}

const hospital = {
    id: 'hospitalId',
    name: 'Test Hospital',
    integrated: false,
};

const mockHospitalService = {
    fetchHospital(): Observable<Hospital> {
        return of(hospital);
    },
    hospital: of(hospital),
};

describe('HcpActionsCardComponent', () => {
    let page: HcpActionsCardComponentPage;
    let localise: SpyObj<LocaliseService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: LocaliseService,
                    useValue: jasmine.createSpyObj('localise', ['fromKey']),
                },
                {
                    provide: HospitalService,
                    useValue: mockHospitalService,
                },
                MockAppointmentFormFactory.buildProvider(),
            ],
            declarations: [
                MockCreateNewMessageComponent,
                MockLocalisePipe,
                HcpActionsCardComponent,
            ],
        });
    });
    beforeEach(() => {
        localise = TestBed.get(LocaliseService);
        localise.fromKey.and.callFake(key => key);
        page = new HcpActionsCardComponentPage(
            TestBed.createComponent(HcpActionsCardComponent),
        );
    });

    describe('behavioural', () => {
        describe('opted out', () => {
            beforeEach(() => {
                const user = TestHCPs.createDrCollins();
                user.optOut = true;
                user.optOutDatetime = '2018-12-12T12:00';
                page.component.hcpData = user;
                page.fixture.detectChanges();
            });
            it('should show consent description', () => {
                expect(page.consentDescription).toBeDefined();
            });
            it('should show disagreed icon', () => {
                expect(page.hcpActionsIcon.nativeElement.src).toContain(
                    'disagreed.svg',
                );
            });
            it('should show "notAgreed"', () => {
                expect(page.consentDescriptionText).toBe('notAgreed');
            });
            it('should show opt out time', () => {
                expect(page.consentDescriptionDateText).toBe('Dec 12, 2018');
            });
        });

        describe('not opted out and pending consent', () => {
            beforeEach(() => {
                const user = TestHCPs.createDrCollins();
                user.optOut = false;
                user.onboardingState.hasConsented = false;
                page.component.hcpData = user;
                page.fixture.detectChanges();
            });
            it('should show consent description', () => {
                expect(page.consentDescription).toBeDefined();
            });
            it('should show pending icon', () => {
                expect(page.hcpActionsIcon.nativeElement.src).toContain(
                    'pending.svg',
                );
            });
            it('should show "pending"', () => {
                expect(page.consentDescriptionText).toBe('pending');
            });
            it('should not show consent time', () => {
                expect(page.consentDescriptionDate).toBeNull();
            });
        });

        describe('not opted out and consented', () => {
            beforeEach(() => {
                const user = TestHCPs.createDrCollins();
                user.optOut = false;
                user.onboardingState.hasConsented = true;
                page.component.hcpData = user;
                page.fixture.detectChanges();
            });
            it('should not show consent details', () => {
                expect(page.consentDescription).toBeNull();
            });
            it('should not show pending icon', () => {
                expect(page.hcpActionsIcon.nativeElement.src).not.toContain(
                    'pending.svg',
                );
            });
            it('should show calendar icon', () => {
                expect(page.hcpActionsIcon.nativeElement.src).toContain(
                    'calendar_b.svg',
                );
            });
            it('should not show consent time', () => {
                expect(page.consentDescriptionDate).toBeNull();
            });
            it('should show create new message component', () => {
                expect(page.createNewMessageComp).not.toBeNull();
            });
            it('should show create appointment link', () => {
                expect(page.createApptLink).not.toBeNull();
                expect(page.createApptLink.nativeElement.innerText).toBe(
                    'createAppt',
                );
            });
            it('should show edit profile link', () => {
                expect(page.editProfileLink).not.toBeNull();
                expect(page.editProfileLink.nativeElement.innerText).toBe(
                    'editProfile',
                );
            });
        });

        describe('integrated CC', () => {
            beforeEach(() => {
                const user = TestHCPs.createDrCollins();
                user.optOut = false;
                user.onboardingState.hasConsented = true;
                page.component.hcpData = user;
                hospital.integrated = true;
                page.fixture.detectChanges();
            });
            it('should not show create appointment link', () => {
                expect(page.createApptLink).toBeNull();
            });
        });
    });
});
