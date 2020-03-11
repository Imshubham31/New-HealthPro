import { Component, Input } from '@angular/core';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

@Component({
    selector: 'app-integrated-avatar-with-label',
    template: `
        <span class="chip">
            <avatar-img size="2.6rem" #avatar></avatar-img>
            <span class="margin-sides-half">
                {{ user.displayName || ('unknownUser' | localise) }}</span
            >
        </span>
    `,
    styleUrls: ['./avatar-with-label.component.scss'],
})
export class IntegratedAvatarWithLabelComponent {
    @Input() user: ParticipantDetails;
}
