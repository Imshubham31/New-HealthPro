import { Injectable } from '@angular/core';
import { MessagesRestService } from '@lib/messages/messages-rest.service';
import { ChatsRestService } from '@lib/messages/chat-rest.service';
import { Stores } from '@lib/utils/stores';
import { Chat } from '@lib/messages/chat.model';
import * as uniqBy from 'lodash/uniqBy';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';
import { Messages } from '@lib/messages/message.model';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import {
    ParticipantDetails,
    Relation,
} from '@lib/participants/participant-details.model';
import { RESTSuccess } from '@lib/jnj-rest/base-rest.service';

export interface NewConversation {
    senderId?: string;
    subject: string;
    body?: string;
    participants: ParticipantDetails[];
}

@Injectable()
export abstract class MessagesService extends Stores.StoreService<Chat> {
    abstract loadMessagesFromUser(userId: string): Observable<Chat[]>;

    constructor(
        protected messagesRestService: MessagesRestService,
        protected chatRestService: ChatsRestService,
    ) {
        super();
    }

    // TODO: Make abstract on store base
    getAll$(): Observable<Chat[]> {
        return this.store$.pipe(map(store => store.list));
    }

    fetchStore$(): Observable<Stores.Store<Chat>> {
        this.fetchItems$()
            .pipe(first())
            .subscribe();
        return this.store$;
    }

    // TODO: Make abstract on store base
    fetchItems$(): Observable<Chat[]> {
        if (!this.cache.isExpired) {
            return this.getAll$();
        }
        super.setStateFetching();
        return this.chatRestService
            .find<Chat>({ subPath: '?includes=messages,participants' })
            .map(next => {
                const uniqueChats = uniqBy(next.data, 'id').sort(
                    (a, b) => b.id - a.id,
                );
                const list = uniqueChats.map(chat => this.buildChat(chat));
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                this.cache.updated();
                return list;
            })
            .pipe(super.catchErrorAndReset());
    }

    refetchOne(chatId: number | string): void {
        super.setStateFetching();
        this.chatRestService
            .findOne<Chat>(chatId, {
                subPath: '?includes=messages,participants',
            })
            .pipe(super.catchErrorAndReset())
            .subscribe(next =>
                this.updateStoreWithEntity(this.buildChat(next.data)),
            );
    }

    // TODO: Make abstract on store base
    create(newConversation: NewConversation) {
        const payload = {
            ...newConversation,
            participants: newConversation.participants.map(
                participantDetail => participantDetail.backendId,
            ),
        };
        return this.messagesRestService.create(payload).pipe(
            super.catchErrorAndReset(),
            tap(chatCreated => this.refetchOne(chatCreated.chatId)),
        );
    }

    sendMessageToChat(message: Messages, chat: Chat): Observable<Object> {
        return this.messagesRestService
            .create({
                chatId: chat.id,
                senderId: AuthenticationService.getUser().backendId,
                subject: chat.subject,
                body: message.body,
                participantDetails: chat.participantDetails,
            })
            .pipe(
                super.catchErrorAndReset(),
                tap(() => this.refetchOne(chat.id)),
            );
    }

    editSubject(chat: Chat, subject: string): Observable<RESTSuccess> {
        return this.chatRestService
            .patch(chat.id, { subject })
            .pipe(super.catchErrorAndReset());
    }

    editParticipants(
        chat: Chat,
        participantsDetails: ParticipantDetails[],
    ): Observable<RESTSuccess> {
        const payload = participantsDetails.map(
            (participant: ParticipantDetails) => participant.backendId,
        );
        return this.chatRestService
            .update(chat.id, payload, { subPath: '/participants' })
            .pipe(super.catchErrorAndReset());
    }

    markChatAsRead(chat: Chat) {
        return this.chatRestService
            .create({}, { subPath: `/${chat.id}/mark-as-read` })
            .pipe(super.catchErrorAndReset())
            .pipe(
                map(next => {
                    chat.unreadMessages = 0;
                    super.updateStoreWithEntity(chat, 'id');
                }),
            );
    }

    hasInactive(chat: Chat): boolean {
        return chat.participantDetails.some(el => el.isActive === false);
    }

    hasRestricted(chat: Chat) {
        return chat.participantDetails.some(
            participant => participant.isRestricted === true,
        );
    }

    hasInvalidRelation(chat: Chat) {
        return chat.participantDetails.some(
            participant => participant.relation === Relation.NotInMdt,
        );
    }

    canReply(chat: Chat) {
        return !(
            this.hasInactive(chat) ||
            this.hasRestricted(chat) ||
            this.hasInvalidRelation(chat)
        );
    }

    protected loadParticipant(allMessages: Chat[], user: User): Chat[] {
        const uniqMessages = uniqBy(allMessages, 'id');
        const userMessages = uniqMessages.filter(
            (messages: Chat) =>
                !!messages.participantDetails.find(
                    details => details.backendId === user.backendId,
                ),
        );
        return userMessages;
    }

    private buildChat(data: Chat) {
        const chat = new Chat();
        chat.id = data.id;
        chat.messages = data.messages.map(
            message =>
                new Messages(
                    message.time,
                    message.body,
                    message.senderId,
                    message.attachments,
                    message.code,
                    message.params,
                ),
        );

        chat.participantDetails = data.participants
            .map(details => ParticipantDetails.parse(details))
            .sort((a, b) => ('' + b.backendId).localeCompare(a.backendId));
        chat.subject = data.subject;
        chat.unreadMessages = data.unreadMessages;
        return chat;
    }
}
