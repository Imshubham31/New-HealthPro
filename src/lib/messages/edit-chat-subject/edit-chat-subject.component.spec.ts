import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { EditChatSubjectComponent } from '@lib/messages/edit-chat-subject/edit-chat-subject.component';
import { FormBuilder } from '@angular/forms';
import { Chat } from './../chat.model';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import { TestParticipantDetails } from './../../../test/support/test-participant-details';
import { MessagesService } from '@lib/messages/messages.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';

let component: EditChatSubjectComponent;
let fixture: ComponentFixture<EditChatSubjectComponent>;
const formBuilder: FormBuilder = new FormBuilder();

const mockChat: Chat = {
    id: '1',
    subject: 'string',
    participantDetails: [
        TestParticipantDetails.build('10'),
        TestParticipantDetails.build('11'),
    ],
    participants: [
        TestParticipantDetails.build('10'),
        TestParticipantDetails.build('11'),
    ],
    messages: [
        {
            body: 'Message text',
            time: new Date(),
            senderId: '11',
        },
    ],
    unreadMessages: 2,
};
const mockModal: ModalWrapperComponent = {
    openModal: () => {
        this.modalActive = true;
    },
    closeModal: () => {
        this.modalActive = false;
    },
    modalTitle: 'mockModalTitle',
    modalSubTitle: 'mockModalSubTitle',
    modalActive: false,
    modalWidth: '500px',
    modalBodyMaxHeight: '500px',
    showCloseBtn: true,
    modalFooter: null,
    onCloseModal: null,
    onOpenModal: null,
    callDestroy: () => {},
};

function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [EditChatSubjectComponent],
        providers: [
            { provide: FormBuilder, useValue: formBuilder },
            {
                provide: ModalService,
                useValue: {
                    create: () => ({
                        open: () => {},
                    }),
                },
            },
            {
                provide: MessagesService,
                useValue: {
                    store$: new BehaviorSubject<any>({
                        list: [mockChat],
                    }),
                    sendMessageToChat: () => of({}),
                    fetchItems$: () => of([mockChat]),
                    disableSendingMessage: () => false,
                    markChatAsRead: () => true,
                    editSubject: () => of(),
                },
            },
            {
                provide: MessagesCoordinatorService,
                useValue: {
                    sendMessage: () => of(true),
                },
            },
            {
                provide: ToastService,
                useValue: {
                    show: () => ({ message: 'success' }),
                },
            },
            {
                provide: LocaliseService,
                useValue: {
                    fromKey: val => val,
                },
            },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EditChatSubjectComponent);
    component = fixture.componentInstance;
    component.modal = mockModal;
    component.start(mockChat);
    fixture.detectChanges();
}

xdescribe('Edit chat subject component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    it('should get title successfully', () => {
        spyOn((component as any).localiseService, 'fromKey');
        component.getTitle();
        expect((component as any).localiseService.fromKey).toHaveBeenCalledWith(
            'editMessageDetails',
        );
    });
    it('should open modal', () => {
        spyOn(component.modal, 'openModal');
        component.open();
        expect(component.modal.openModal).toHaveBeenCalled();
    });
    it('should close modal', () => {
        spyOn(component.modal, 'closeModal');
        component.close();
        expect(component.modal.closeModal).toHaveBeenCalled();
    });
    describe('behaviours', () => {
        it('shouldnt submit if form is invalid', () => {
            spyOn(
                (component as any).messagesService,
                'editSubject',
            ).and.returnValue(of());
            component.submit();
            expect(
                (component as any).messagesService.editSubject,
            ).not.toHaveBeenCalled();
        });
        it('should submit if form is valid', () => {
            spyOn(
                (component as any).messagesService,
                'editSubject',
            ).and.returnValue(of(true));
            spyOn((component as any).toastService, 'show');
            component.form.get('subject').setValue('correct subject');
            component.submit();
            expect(
                (component as any).messagesService.editSubject,
            ).toHaveBeenCalledWith(mockChat, 'correct subject');
            expect((component as any).toastService.show).toHaveBeenCalledWith(
                null,
                'subjectChangedSuccess',
            );
        });
        it('should submit if form is valid', () => {
            spyOn(
                (component as any).messagesService,
                'editSubject',
            ).and.returnValue(Observable.throw({}));
            spyOn((component as any).toastService, 'show');
            component.form.get('subject').setValue('correct subject');
            component.submit();
            expect(
                (component as any).messagesService.editSubject,
            ).toHaveBeenCalledWith(mockChat, 'correct subject');
            expect((component as any).toastService.show).toHaveBeenCalledWith(
                null,
                'subjectChangeFail',
                ToastStyles.Error,
            );
        });
    });
});
