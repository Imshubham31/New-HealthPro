import { Component, Input } from '@angular/core';

@Component({
    selector: 'new-message-info',
    template: `
        <div>
            <span
                [ngClass]="{ 'badge btn btn-link padding-0': messageCount > 0 }"
            >
                <img src="./../../../assets/messages_b.svg" />
            </span>
        </div>
        <div class="icon-padding">
            <div class="title appointment-subphase">
                {{ 'messages' | localise }}
            </div>
            <div class="value">
                <a
                    [routerLink]="['/messages', { outlets: { master: 'all' } }]"
                    [queryParams]="{ patientId: userId }"
                >
                    <span *ngIf="messageCount === 1"
                        >{{ messageCount | localise }}
                        {{ 'unreadMessage' | localise }}</span
                    >
                    <span *ngIf="messageCount > 1"
                        >{{ messageCount | localise }}
                        {{ 'unreadMessages' | localise }}</span
                    >
                </a>
                <span *ngIf="messageCount === 0">{{
                    'noUnreadMessages' | localise
                }}</span>
            </div>
        </div>
    `,
    styleUrls: [
        './new-message-info.component.scss',
        '../next-appt-info/next-appt-info.component.scss',
    ],
})
export class NewMessageInfoComponent {
    @Input() messageCount = 0;
    @Input() userId: string;
}
