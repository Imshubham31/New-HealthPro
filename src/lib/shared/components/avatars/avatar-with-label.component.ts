import { RestrictProcessingPipe } from './../../services/restricted-user.pipe';
import { User } from './../../../authentication/user.model';
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AvatarImgComponent } from '@lib/shared/components/avatars/avatar-img.component';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
@Component({
    selector: 'app-avatar-with-label',
    template: `
        <span class="chip" [class.chipBlock]="chipBlock"  [class.disabled]="user.isRestricted">
            <avatar-img [user]="user" size="2.6rem" #avatar></avatar-img>
            <span class="margin-sides-half" [class.patient]="isPatient">
                {{ label }}</span
            >
        </span>
    `,
    styleUrls: ['./avatar-with-label.component.scss'],
})
export class AvatarWithLabelComponent implements OnChanges {
    @Input() user: User | ParticipantDetails;
    @Input() chipBlock = false;
    @ViewChild('avatar', { static: true }) avatar: AvatarImgComponent;
    constructor(private restrictProcessingPipe: RestrictProcessingPipe) {}

    get label() {
        return this.restrictProcessingPipe.transform(this.user);
    }

    get isPatient(): boolean {
        return (
            this.user && this.user.backendId.toLowerCase().startsWith('patient')
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user && changes.user.currentValue) {
            this.avatar.refresh();
        }
    }
}
