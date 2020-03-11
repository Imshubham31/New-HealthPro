import { Subscription } from 'rxjs';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnInit,
} from '@angular/core';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { Chat } from '@lib/messages/chat.model';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PatientService } from 'app/patients/patient.service';
import { PatientOverview } from 'app/patients/view-patient.model';
import { Patient } from 'app/patients/patient.model';
@Unsubscribe()
@Component({
    selector: 'all-messages-container',
    templateUrl: './all-messages-container.component.html',
    styleUrls: ['./all-messages-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllMessagesContainerComponent extends VirtualScroll
    implements OnInit {
    subscriptions: Subscription[];
    chats: Chat[] = [];
    user: User;
    viewPortItems: Chat[];
    patientsMap: Map<string, Patient>;
    get searchFields() {
        return Chat.searchFields;
    }

    constructor(
        public messagesCoordinatorService: MessagesCoordinatorService,
        public route: ActivatedRoute,
        public ref: ChangeDetectorRef,
        private patientService: PatientService,
    ) {
        super();
        this.user = AuthenticationService.getUser();
        this.patientsMap = new Map<string, Patient>();
    }

    ngOnInit() {
        this.subscriptions = [
            this.patientService
                .fetchPatients()
                .subscribe((patients: PatientOverview[]) => {
                    if (!patients) {
                        return;
                    }
                    const refreshedMap = new Map<string, Patient>();
                    patients
                        .map((overview: PatientOverview) => overview.patient)
                        .forEach((patient: Patient) =>
                            refreshedMap.set(patient.backendId, patient),
                        );
                    this.patientsMap = refreshedMap;
                    this.ref.detectChanges();
                }),
            this.route.parent.queryParams
                .pipe(
                    switchMap(res => {
                        return this.messagesCoordinatorService.getSortedChats$(
                            // tslint:disable-next-line:no-string-literal
                            res['patientId'],
                        );
                    }),
                )
                .subscribe((chats: Chat[]) => {
                    this.chats = chats;
                    this.ref.detectChanges();
                }),
        ];
    }
}
