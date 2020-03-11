import { Component, Input } from '@angular/core';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { StartNewConversationComponent } from '@lib/messages/start-new-conversation/start-new-conversation.component';
import { Hcp } from 'app/hcp/hcp.model';

@Component({
    selector: 'create-new-message',
    template: `
        <img class="hcp-actions-icon" src="../../../assets/messages_b.svg" />
        <a class="link" (click)="showNewMessageModal(hcp)">{{
            'sendMessage' | localise
        }}</a>
    `,
    styleUrls: ['./create-new-message.component.scss'],
})
export class CreateNewMessageComponent {
    @Input() hcp: Hcp;
    private startConversationModal: StartNewConversationComponent;

    constructor(private modalService: ModalService) {}

    showNewMessageModal(hcp: Hcp) {
        this.startConversationModal = this.modalService.create<
            StartNewConversationComponent
        >(StartNewConversationComponent);
        this.startConversationModal.startWithHcp(hcp);
    }
}
