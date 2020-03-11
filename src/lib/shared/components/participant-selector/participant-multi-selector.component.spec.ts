import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ParticipantMultiSelectorComponent } from './participant-multi-selector.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { SharedModule } from '@lib/shared/shared.module';
import { ParticipantsService } from '@lib/participants/participants.service';
import { of } from 'rxjs';
import { TestParticipantDetails } from 'test/support/test-participant-details';

xdescribe('ParticipantMultiSelectorComponent', () => {
    let fixture: ComponentFixture<ParticipantMultiSelectorComponent>;
    let component: ParticipantMultiSelectorComponent;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                {
                    provide: ParticipantsService,
                    useValue: {
                        filteredStore: () => of(),
                        fetch: () => {},
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromParams: () => {},
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ParticipantMultiSelectorComponent);
        component = fixture.componentInstance;
    });
    describe('checkTagDisabled', () => {
        it('should disable', () => {
            const testhcp = TestParticipantDetails.build(
                'hcp-b7fb8cbf-a787-4562-902e-7518d5e997ad',
            );
            testhcp.isRestricted = true;
            component.disableRestricted = true;
            expect(component.checkTagDisabled(testhcp)).toBe(true);
        });
        it('should enable', () => {
            const testhcp = TestParticipantDetails.build(
                'hcp-b7fb8cbf-a787-4562-902e-7518d5e997ad',
            );
            testhcp.isRestricted = false;
            component.disableRestricted = true;
            expect(component.checkTagDisabled(testhcp)).toBe(false);
        });
        it('should not disable if disableRestricted is false', () => {
            const testhcp = TestParticipantDetails.build(
                'hcp-b7fb8cbf-a787-4562-902e-7518d5e997ad',
            );
            testhcp.isRestricted = true;
            component.disableRestricted = false;
            expect(component.checkTagDisabled(testhcp)).toBe(false);
        });
    });
});
