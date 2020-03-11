import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { SharedModule } from '@lib/shared/shared.module';
import { HcpMessagesService } from './messages.service';
import { MessagesService } from '@lib/messages/messages.service';
import { MessagesModule } from '@lib/messages/messages.module';

@NgModule({
    imports: [CommonModule, SharedModule, LocaliseModule, MessagesModule],
    declarations: [],
    providers: [
        { provide: MessagesService, useClass: HcpMessagesService },
        LocaliseService,
    ],
    exports: [],
})
export class HcpMessagesModule {}
