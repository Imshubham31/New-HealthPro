import { Restrictable } from './../../../authentication/user.model';
import { LocaliseService } from './../../../localise/localise.service';
import { EventEmitter, Input } from '@angular/core/';
import { Component, OnInit, Output } from '@angular/core';
import {
    ParticipantType,
    ParticipantsService,
} from '@lib/participants/participants.service';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';

@Component({
    selector: 'participant-selector',
    template: `
        <div
            class="loading"
            *ngIf="
                (participantsService.store$ | async).isFetching;
                else showParticipants
            "
        ></div>
        <ng-template #showParticipants>
            <app-modal-select
                [options]="
                    this.participantsService.filteredStore$(
                        this.participantType
                    ) | async
                "
                [labelFormatter]="labelFormatter"
                (onChange)="onChange.emit($event)"
                matchProperty="backendId"
            >
            </app-modal-select>
        </ng-template>
    `,
})
export class ParticipantSelectorComponent implements OnInit {
    @Output() onChange = new EventEmitter();
    @Input() participantType: ParticipantType;
    get labelFormatter() {
        return (user: Restrictable) =>
            new RestrictProcessingPipe(this.localiseService).transform(user);
    }

    constructor(
        public participantsService: ParticipantsService,
        private localiseService: LocaliseService,
    ) {}

    ngOnInit(): void {
        this.participantsService.fetch();
    }
}
