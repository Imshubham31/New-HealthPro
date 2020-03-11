import { TestBed } from '@angular/core/testing';
import { ParticipantSelectorComponent } from './participant-selector.component';
import { TestHCPs } from 'test/support/test-hcps';
import { Component, Input } from '@angular/core';
import { ParticipantsService } from '@lib/participants/participants.service';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'app-modal-select',
    template: `
        <p></p>
    `,
})
class MockModalSelectComponent {
    @Input() options;
    @Input() labelFormatter;
}

xdescribe('ParticipantSelectorComponent', () => {
    let component;
    let fixture;
    const mockParticipants = [TestHCPs.createDrCollins()];

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ParticipantsService,
                    useValue: {
                        fetch: jasmine.createSpy(),
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromParams: () => {},
                    },
                },
            ],
            declarations: [
                ParticipantSelectorComponent,
                MockModalSelectComponent,
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ParticipantSelectorComponent);
        component = fixture.componentInstance;
    });

    it('should fetch', () => {
        const service = TestBed.get(ParticipantsService);
        component.ngOnInit();
        expect(service.fetch).toHaveBeenCalledTimes(1);
    });
    it('should format participant name', () => {
        expect(component.labelFormatter(mockParticipants[0])).toBe(
            `${mockParticipants[0].firstName} ${mockParticipants[0].lastName}`,
        );
    });
});
