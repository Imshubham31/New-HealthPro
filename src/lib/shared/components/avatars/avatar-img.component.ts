import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { AvatarService } from '@lib/shared/components/avatars/avatar.service';
import { User } from '@lib/authentication/user.model';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'avatar-img',
    template: `
        <img
            class="circle"
            [src]="profile"
            [style.height]="size"
            [style.width]="size"
            [style.border-radius]="radius"
        />
    `,
    styles: [
        `
            :host {
                display: block;
            }
            img {
                margin: auto;
            }
        `,
    ],
})
export class AvatarImgComponent implements OnChanges, OnDestroy {
    @Input() user: User | ParticipantDetails;
    @Input() size = '30px';
    @Input() radius = '50%';
    // @Input() marl = '-20px';

    environment = environment;
    profile = this.sanitizer.bypassSecurityTrustUrl('/assets/Avatar.svg');
    subscription: Subscription;
    constructor(
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef,
        private avatarService: AvatarService,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.user &&
            changes.user.firstChange &&
            changes.user.currentValue
        ) {
            this.fetchImage(
                (changes.user.currentValue as User | ParticipantDetails)
                    .backendId,
            );
        }
    }

    ngOnDestroy(): void {
        this.ref.detach();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public refresh() {
        if (this.user) {
            this.fetchImage(this.user.backendId, true);
        }
    }

    private fetchImage(backendId: string, bustCache = false) {
        if (this.user.isRestricted) {
            return;
        }
        this.subscription = this.avatarService
            .getAvatar(backendId, bustCache)
            .subscribe(url => {
                this.profile = url;
                if (this.ref['destroyed']) {
                    return;
                }
                this.ref.detectChanges();
            });
    }
}
