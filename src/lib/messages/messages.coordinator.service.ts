import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { Chat } from '@lib/messages/chat.model';
import { EditChatSubjectComponent } from '@lib/messages/edit-chat-subject/edit-chat-subject.component';
import { MessagesService } from '@lib/messages/messages.service';
import { StartNewConversationComponent } from '@lib/messages/start-new-conversation/start-new-conversation.component';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { Observable, OperatorFunction } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Stores } from '@lib/utils/stores';

@Injectable()
export class MessagesCoordinatorService {
    constructor(
        private messageService: MessagesService,
        private modalService: ModalService,
    ) {}

    getSortedChats$(participantId?: string): Observable<Chat[]> {
        return this.messageService.fetchStore$().pipe(
            tap((store: Stores.Store<Chat>) => {
                AppCoordinator.loadingOverlay.next({
                    loading: store.isFetching,
                });
            }),
            map(store => store.list),
            this.filterMessages(participantId),
            this.sortMessages(),
        );
    }

    sendMessage(chat: Chat, message: string) {
        return this.messageService.sendMessageToChat(
            {
                body: message,
                time: new Date(),
            },
            chat,
        );
    }

    showStartNewConversationModal() {
        this.modalService
            .create<StartNewConversationComponent>(
                StartNewConversationComponent,
            )
            .open();
    }

    showEditChatSubject(chat: Chat) {
        this.modalService
            .create<EditChatSubjectComponent>(EditChatSubjectComponent)
            .start(chat);
    }

    private filterMessages(
        participantId?: string,
    ): OperatorFunction<Chat[], Chat[]> {
        if (!participantId) {
            return chats => chats;
        }
        return map((chats: Chat[]) =>
            chats.filter((chat: Chat) =>
                chat.participantDetails.some(
                    details => details.backendId === participantId,
                ),
            ),
        );
    }

    private sortMessages() {
        return map((chats: Chat[]) => {
            return chats
                .sort(
                    (chatA, chatB) =>
                        new Date(
                            chatB.messages[chatB.messages.length - 1].time,
                        ).getTime() -
                        new Date(
                            chatA.messages[chatA.messages.length - 1].time,
                        ).getTime(),
                )
                .sort(
                    (chatA, chatB) =>
                        chatB.unreadMessages - chatA.unreadMessages,
                );
        });
    }
}
