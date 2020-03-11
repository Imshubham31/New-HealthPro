import { Component, Input } from '@angular/core';
import { ParticipantSelectorComponent } from './participant-selector.component';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

@Component({
    selector: 'participant-multi-selector',
    template: `
        <div
            class="loading"
            *ngIf="
                (participantsService.store$ | async).isFetching;
                else showParticipants
            "
        ></div>
        <ng-template #showParticipants>
            <app-modal-multi-tag-input
                [options]="
                    this.participantsService.filteredStore$(
                        this.participantType
                    ) | async
                "
                [labelFormatter]="labelFormatter"
                [detailLabelFormatter]="role ? roleLabel : null"
                [checkTagDisabled]="checkTagDisabled.bind(this)"
                matchProperty="backendId"
                [placeholder]="placeholdertext | localise"
            ></app-modal-multi-tag-input>
        </ng-template>
    `,
})
export class ParticipantMultiSelectorComponent extends ParticipantSelectorComponent {
    @Input() disableRestricted = false;
    @Input() role = false;
    @Input() placeholdertext = 'enterANewHCP';
    @Input() participantTagDisabled = (_participant: ParticipantDetails) =>
        false

    checkTagDisabled(user: ParticipantDetails) {
        return (
            this.participantTagDisabled(user) ||
            (this.disableRestricted ? !!user.isRestricted : false)
        );
    }

    get roleLabel() {
        return (user: any) => user.role;
    }
}
