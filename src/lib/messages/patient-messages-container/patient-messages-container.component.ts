import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { BaseForm } from '@lib/shared/services/base-form';
import { Chat } from './../chat.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { MessagesService } from '@lib/messages/messages.service';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { isSameDay } from 'date-fns';
import isEqual from 'date-fns/isEqual';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { ArrayUtils } from '@lib/utils/array-utils';
import { DateUtils } from '@lib/utils/date-utils';

@Unsubscribe()
@Component({
    selector: 'patient-messages-container',
    templateUrl: './patient-messages-container.component.html',
    styleUrls: ['./patient-messages-container.component.scss'],
})
export class PatientMessagesContainerComponent extends BaseForm
    implements OnInit {
    chat: Chat;
    user = AuthenticationService.getUser();
    subscriptions: Subscription[] = [];
    participantMap: Map<string, ParticipantDetails>;

    constructor(
        private fb: FormBuilder,
        public localiseService: LocaliseService,
        public messagesService: MessagesService,
        public messagesCoordinatorService: MessagesCoordinatorService,
        private toastService: ToastService,
        private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit() {
        this.setupForm();
        this.subscriptions = [
            combineLatest([
                this.route.params,
                this.messagesService.fetchItems$(),
            ])
                .pipe(
                    this.getChatWhenFetched(),
                    tap((chat: Chat) => {
                        if (chat && chat.unreadMessages > 0) {
                            this.messagesService
                                .markChatAsRead(chat)
                                .subscribe();
                        }
                        this.participantMap = null;
                        this.chat = chat;
                        if (chat) {
                            this.participantMap = ArrayUtils.toMap(
                                chat.participantDetails,
                                (p: ParticipantDetails) => p.backendId,
                            );
                        }
                    }),
                )
                .subscribe(),
        ];
    }

    private getChatWhenFetched() {
        return flatMap(([params, chats]: [any, Chat[]]) => {
            if (!params.id || chats.length === 0) {
                return of();
            }
            return of(chats.find(chat => chat.id.toString() === params.id));
        });
    }

    setupForm(): void {
        this.formError = undefined;
        this.form = this.fb.group({
            message: ['', [Validators.required]],
        });
    }

    shouldDisableSubmit() {
        return !this.form.valid;
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        this.messagesCoordinatorService
            .sendMessage(this.chat, this.form.get('message').value)
            .subscribe(
                () => this.cleanForm(),
                () => {
                    this.toastService.show(
                        null,
                        this.localiseService.fromKey('messageNotSent'),
                        ToastStyles.Error,
                    );
                },
            );
    }

    formatDate(chatDate: Date): string {
        const chatDateIn = new Date(chatDate);
        const chatDateTimeLess = new Date(chatDate).setHours(0, 0, 0, 0);

        const today = new Date().setHours(0, 0, 0, 0);
        if (isEqual(chatDateTimeLess, today)) {
            return this.localiseService.fromKey('today');
        }
        return DateUtils.formatDateUserPreference(chatDateIn);
    }

    shouldDisplayDate(current: Date, previous: any) {
        if (current && !previous) {
            return true;
        }

        return isSameDay(new Date(current), new Date(previous));
    }
}
