import { DeleteMessagetemplateComponent } from './../delete-messagetemplate/delete-messagetemplate.component';
import { MessageTemplate } from './../../messagetemplate.model';
import { MessageService } from './../../message.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ModalService } from './../../../../lib/shared/components/modal/modal.service';
import { EditMessageTempState } from '../message-temp-form/edit-message-temp.state';
import { CreateMessageTempState } from './../message-temp-form/create-message-temp.state';
import { MessageTempFormComponent } from './../message-temp-form/message-temp-form.component';
import { LocaliseService } from '@lib/localise/localise.service';
@Component({
    selector: 'app-message-template',
    templateUrl: './message-template.component.html',
    styleUrls: ['./message-template.component.scss'],
})
export class MessageTemplateComponent implements OnInit, OnDestroy {
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    messageList: MessageTemplate[];
    showTable: Boolean = false;
    careModulesList: CareModuleModel[];
    dtTrigger: Subject<any> = new Subject();
    private deletetemplate: DeleteMessagetemplateComponent;
    constructor(
        private messageService: MessageService,
        private modalService: ModalService,
        private localise: LocaliseService,
    ) {}

    ngOnInit() {
        this.dtOptions = {
            order: [],
            paging: false,
            info: false,
            retrieve: true,
            language: {
                search: '',
                searchPlaceholder: this.localise.fromKey('searchPlaceholder'),
            },
            columnDefs: [{ width: '120px', targets: '4' }],
            columns: [null, null, null, { orderable: false }],
        };
        AppCoordinator.loadingOverlay.next({ loading: true });
        observableCombineLatest(
            this.messageService.getMessageTemplate(),
            this.messageService.getCaremoduleTitle(),
        )
            .pipe(
                map(([messageList, caredModuleList]) => {
                    this.messageList = messageList;
                    this.careModulesList = caredModuleList;
                    this.showTable = true;
                    this.dtTrigger.next();
                    AppCoordinator.loadingOverlay.next({ loading: false });
                }),
                catchError(err => {
                    AppCoordinator.loadingOverlay.next({ loading: false });
                    return err;
                }),
            )
            .subscribe();
    }
    getCareModuleTitle(caremoduleId) {
        return this.careModulesList.find(care => care.id === caremoduleId)
            .title;
    }
    deletetemplatemodal(messageId) {
        this.deletetemplate = this.modalService.create<
            DeleteMessagetemplateComponent
        >(DeleteMessagetemplateComponent, {
            tempId: messageId,
        });
        this.deletetemplate.open();
        this.deletetemplate.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.messageList.splice(
                    this.messageList.findIndex(item => item.id === messageId),
                    1,
                );
                this.dtTrigger.next();
            });
        });
    }
    startMessageCreate() {
        const addtemplate = this.modalService.create<MessageTempFormComponent>(
            MessageTempFormComponent,
            {
                state: new CreateMessageTempState(this.localise),
                careModulesList: this.careModulesList,
            },
        );
        addtemplate.open();
        addtemplate.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.messageList.push(this.messageService.newMessageTemp);
                this.dtTrigger.next();
            });
        });
    }

    startMessageEdit(messageTemp: MessageTemplate) {
        const editMessageTemp = this.modalService.create<
            MessageTempFormComponent
        >(MessageTempFormComponent, {
            state: new EditMessageTempState(this.localise),
            careModulesList: this.careModulesList,
            messageTemplate: messageTemp,
        });
        editMessageTemp.open();
        editMessageTemp.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.messageList = this.messageService.getUpdatedMessages();
                this.dtTrigger.next();
            });
        });
    }
    ngOnDestroy() {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }
}
