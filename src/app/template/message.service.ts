import { MessageRestService } from './message-rest.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import * as merge from 'lodash/merge';
import { Cache } from '@lib/utils/cache';
import { Stores } from '@lib/utils/stores';
import { MessageTemplate } from './messagetemplate.model';
@Injectable({
    providedIn: 'root',
})
export class MessageService extends Stores.StoreService<MessageTemplate> {
    cache = new Cache();
    newMessageTemp: MessageTemplate;
    constructor(
        private messageRestservice: MessageRestService,
        private hospitalrestservice: HospitalsRestService,
    ) {
        super();
    }

    getMessageTemplate() {
        return this.messageRestservice.find<MessageTemplate>().pipe(
            map(messagetemplate => {
                const list = messagetemplate.data;
                this.store$.next({
                    ...this.store$.value,
                    list,
                    isFetching: false,
                });
                return list;
            }),
        );
    }
    getCaremoduleTitle() {
        return this.hospitalrestservice.findCareModules();
    }
    deleteMessageTemplate(id) {
        return this.messageRestservice.remove(id).pipe();
    }
    createMessageTemplate(messageTemplate: MessageTemplate) {
        return this.messageRestservice.create(messageTemplate).pipe(
            tap(() => {
                this.store$.next({
                    ...this.store$.value,
                    isFetching: false,
                });
            }),
        );
    }
    getUpdatedMessages() {
        return this.store$.getValue().list;
    }
    getappTemplateId(id: string) {
        return this.store$
            .getValue()
            .list.find(messageTemplate => messageTemplate.id === id);
    }
    updateMessageTemplate(id: string, messageTemplate: MessageTemplate) {
        return this.messageRestservice
            .patch(id, messageTemplate, { gxpReason: 'new changes' })
            .pipe(
                tap(() => {
                    messageTemplate.id = id;
                    const updatedMessageTemplate: MessageTemplate = this.getappTemplateId(
                        messageTemplate.id,
                    );
                    merge(updatedMessageTemplate, messageTemplate);
                    this.updateStoreWithEntity(updatedMessageTemplate, 'id');
                }),
                super.catchErrorAndReset(),
            );
    }
}
