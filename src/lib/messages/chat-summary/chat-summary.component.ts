import {
    Component,
    Input,
    HostBinding,
    SimpleChanges,
    OnChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { User } from '@lib/authentication/user.model';
import { Patient } from 'app/patients/patient.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { Messages } from '@lib/messages/message.model';
import isEqual from 'date-fns/isEqual';
import { differenceInDays } from 'date-fns';
import { DateUtils } from '@lib/utils/date-utils';

@Component({
    selector: 'chat-summary',
    templateUrl: './chat-summary.component.html',
    styleUrls: ['./chat-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatSummaryComponent implements OnChanges {
    @Input() title: string;
    @Input() lastMessage: Messages;
    @Input() user: User;
    @Input() users: ParticipantDetails[];
    @Input() count: number;
    @Input() patientsMap: Map<string, Patient>;
    @HostBinding('class.selected')
    selected = false;

    sortedUsers: ParticipantDetails[];
    lastUser: ParticipantDetails = null;

    constructor(public localiseService: LocaliseService) {}

    public isPatient(user: ParticipantDetails): boolean {
        return user.backendId.toLowerCase().startsWith('patient');
    }

    getDobSuffix(patientId: string): string {
        if (!this.patientsMap) {
            return '';
        }
        const patient = this.patientsMap.get(patientId);
        if (!patient || !patient.dob) {
            return '';
        }
        const dob = DateUtils.formatDateUserPreference(
            DateUtils.clearTime(new Date(patient.dob)),
        );
        return ` (${dob})`;
    }

    trackByBackendId(_index: number, item: ParticipantDetails) {
        return item.backendId;
    }

    formatDate(msgDate: Date) {
        const msgDateIn = new Date(msgDate);
        const msgDateTimeLess = new Date(msgDate).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        if (isEqual(msgDateTimeLess, today)) {
            return DateUtils.formatDate(msgDateIn, 'HH:mm');
        }
        const x = differenceInDays(today, msgDateTimeLess);
        if (x === 1) {
            return this.localiseService.fromKey('yesterday');
        }
        if (x > 1 && x < 7) {
            return DateUtils.formatDate(msgDateIn, 'EEEE');
        }
        return DateUtils.formatDateUserPreference(msgDateIn);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.users) {
            const usersClone = this.users
                .filter(
                    (participant: ParticipantDetails) =>
                        participant.backendId !== this.user.backendId,
                )
                .sort((a: ParticipantDetails, b: ParticipantDetails) => {
                    if (this.isPatient(a)) {
                        if (!this.isPatient(b)) {
                            return -1;
                        }
                    } else if (this.isPatient(b)) {
                        return 1;
                    }
                    return a.displayName.localeCompare(b.displayName);
                });
            this.sortedUsers = usersClone;
        }
        if (changes.lastMessage) {
            if (!this.lastMessage.senderId) {
                this.lastUser = null;
                return;
            }
            this.lastUser = this.users.find(
                (user: ParticipantDetails) =>
                    user.backendId === this.lastMessage.senderId,
            );
        }
    }
}
