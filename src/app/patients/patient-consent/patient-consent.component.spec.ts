import { TestBed } from '@angular/core/testing';

import { PatientConsentComponent } from './patient-consent.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Patient } from '../patient.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { SharedModule } from '@lib/shared/shared.module';

const mockPatient = new Patient();
mockPatient.onboardingState = {
    hasConsented: true,
    hasUpdatedPassword: false,
    hasUpdatedProfilePicture: false,
};
mockPatient.optOut = false;

describe('PatientConsentComponent', () => {
    let component: PatientConsentComponent;
    let localise: LocaliseService;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, SharedModule],
            declarations: [PatientConsentComponent],
            providers: [PatientConsentComponent],
        });
        component = TestBed.get(PatientConsentComponent);
        component.patient = mockPatient;
        localise = TestBed.get(LocaliseService);
    });

    it('should show user has consented', () => {
        const consentDesctription = component.getConsentDescription();
        expect(consentDesctription.description).toEqual(
            localise.fromKey('agreed'),
        );
    });

    it('should show user has not consented', () => {
        component.patient.optOut = true;
        component.patient.onboardingState.hasConsented = false;
        const consentDesctription = component.getConsentDescription();
        expect(consentDesctription.description).toEqual(
            localise.fromKey('notAgreed'),
        );
    });

    it('should show if consent is pending', () => {
        component.patient.optOut = false;
        component.patient.onboardingState.hasConsented = false;
        const consentDesctription = component.getConsentDescription();
        expect(consentDesctription.description).toEqual(
            localise.fromKey('pending'),
        );
    });
});
