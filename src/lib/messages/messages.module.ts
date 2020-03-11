import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocaliseModule } from '@lib/localise/localise.module';
import { AllMessagesContainerComponent } from '@lib/messages/all-messages-container/all-messages-container.component';
import { ChatsRestService } from '@lib/messages/chat-rest.service';
import { EditChatSubjectComponent } from '@lib/messages/edit-chat-subject/edit-chat-subject.component';
import { MessagesRestService } from '@lib/messages/messages-rest.service';
import { MessagesRoutingModule } from '@lib/messages/messages-routing.module';
import { PatientMessagesContainerComponent } from '@lib/messages/patient-messages-container/patient-messages-container.component';
import { StartNewConversationComponent } from '@lib/messages/start-new-conversation/start-new-conversation.component';
import { SharedModule } from '@lib/shared/shared.module';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import { SystemMessagesComponent } from './system-messages/system-messages.component';
import { ChatSummaryComponent } from './chat-summary/chat-summary.component';

@NgModule({
    imports: [
        CommonModule,
        MessagesRoutingModule,
        SharedModule,
        LocaliseModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        PatientMessagesContainerComponent,
        AllMessagesContainerComponent,
        StartNewConversationComponent,
        EditChatSubjectComponent,
        SystemMessagesComponent,
        ChatSummaryComponent,
    ],
    providers: [
        MessagesRestService,
        ChatsRestService,
        MessagesCoordinatorService,
    ],
    exports: [StartNewConversationComponent],
    entryComponents: [StartNewConversationComponent, EditChatSubjectComponent],
})
export class MessagesModule {}
