import { Component, Input } from '@angular/core';
import { Messages } from '../message.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { ParamsValues } from '../attachment.model';

@Component({
    selector: 'system-messages',
    templateUrl: './system-messages.component.html',
    styleUrls: ['./system-messages.component.scss'],
})
export class SystemMessagesComponent {
    @Input() message: Messages;

    constructor(private localise: LocaliseService) {}

    public get formattedMessage(): string {
        switch (this.message.code) {
            case 'ADD_PARTICIPANT':
                return this.localise.fromParams(
                    'addChatParticipant',
                    this.getParams(['REQUESTER_NAME', 'PARTICIPANT_NAME']),
                );
            case 'REMOVE_PARTICIPANT':
                return this.localise.fromParams(
                    'removeChatParticipant',
                    this.getParams(['REQUESTER_NAME', 'PARTICIPANT_NAME']),
                );
        }
        return ''; // not supported code, but can happen with backwards compatibility
    }

    private getParams(keys: string[], replaceIfNull?: ''): string[] {
        const values = [];
        keys.forEach((key: string) => {
            const found = this.message.params.find(
                (val: ParamsValues) =>
                    val.name.toUpperCase() === key.toUpperCase(),
            );
            values.push(found ? found.value : replaceIfNull);
        });
        return values;
    }
}
