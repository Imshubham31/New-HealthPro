import { Observable, combineLatest } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { LocaliseService } from '@lib/localise/localise.service';
import { PatientService } from '../patients/patient.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { Chat } from '@lib/messages/chat.model';
import { MessagesRestService } from '@lib/messages/messages-rest.service';
import { ChatsRestService } from '@lib/messages/chat-rest.service';
import { MessagesService } from '@lib/messages/messages.service';

@Injectable()
export class HcpMessagesService extends MessagesService {
    constructor(
        protected messagesRestService: MessagesRestService,
        protected chatRestService: ChatsRestService,
        protected toastService: ToastService,
        protected localiseService: LocaliseService,
        private patientService: PatientService,
    ) {
        super(messagesRestService, chatRestService);
    }

    loadMessagesFromUser(patientId: string): Observable<Chat[]> {
        return combineLatest(
            this.getAll$().pipe(
                map(chats =>
                    chats.filter(
                        chat =>
                            !!chat.participantDetails.find(
                                details => details.backendId === patientId,
                            ),
                    ),
                ),
            ),
            this.patientService.getPatient$(patientId),
        ).pipe(
            map(([chats, patientOverview]) =>
                this.loadParticipant(chats, patientOverview.patient),
            ),
        );
    }
}
