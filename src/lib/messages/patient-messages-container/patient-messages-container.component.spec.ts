import { spyOnSubscription } from './../../../test/support/custom-spies';
import { TestHCPs } from './../../../test/support/test-hcps';
import { FormBuilder } from '@angular/forms';
import { Chat } from './../chat.model';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import { TestParticipantDetails } from './../../../test/support/test-participant-details';
import { MessagesService } from '@lib/messages/messages.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { of, BehaviorSubject, Observable } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { PatientMessagesContainerComponent } from './patient-messages-container.component';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

let component: PatientMessagesContainerComponent;
let fixture: ComponentFixture<PatientMessagesContainerComponent>;
const formBuilder: FormBuilder = new FormBuilder();

@Pipe({ name: 'amDateFormat' })
class MockDateAmPipe implements PipeTransform {
    transform(value: any[], args: any): any[] {
        return value;
    }
}

@Pipe({ name: 'amFromUnix' })
class MockAmFromUnixPipe implements PipeTransform {
    transform(value: any[], args: any): any[] {
        return value;
    }
}

@Pipe({ name: 'restricted' })
class MockRestrictedPipe implements PipeTransform {
    transform(value: any[], args: any): any[] {
        return value;
    }
}

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
        {
            code: 'PARTICIPANT_REMOVED',
            time: new Date(),
            params: [
                {
                    name: 'REQUESTER_NAME',
                    value: 'mr req',
                },
                {
                    name: 'PARTICIPANT_NAME',
                    value: 'mr removed',
                },
            ],
        },
    ],
    unreadMessages: 2,
};

function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [
            PatientMessagesContainerComponent,
            MockDateAmPipe,
            MockAmFromUnixPipe,
            MockRestrictedPipe,
        ],
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
                    hasInactive: () => false,
                    hasDisabled: () => false,
                    hasInvalidRelation: () => false,
                    canReply: () => true,
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
                provide: ActivatedRoute,
                useValue: {
                    params: new BehaviorSubject({ id: mockChat.id }),
                },
            },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
}

describe('Patient messages container component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    beforeEach(() => {
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        fixture = TestBed.createComponent(PatientMessagesContainerComponent);
        component = fixture.componentInstance;
        component.chat = mockChat;
        fixture.detectChanges();
    });
    afterEach(() => AuthenticationService.deleteUser());

    describe('mark as read', () => {
        it('should mark not mark chat as read if there are no unread messages', () => {
            const spy = spyOnSubscription(
                component.messagesService,
                'markChatAsRead',
                of({}),
            );
            mockChat.unreadMessages = 0;
            component.ngOnInit();
            expect(spy.subscribe).not.toHaveBeenCalled();
            spy.reset();
        });
        it('should mark chat as read if there unread messages', () => {
            const spy = spyOnSubscription(
                component.messagesService,
                'markChatAsRead',
                of({}),
            );
            mockChat.unreadMessages = 1;
            component.ngOnInit();
            expect(spy.subscribe).toHaveBeenCalled();
            spy.reset();
        });
    });

    it('should not submit if form is invalid', () => {
        spyOn(
            component.messagesCoordinatorService,
            'sendMessage',
        ).and.returnValue(of(true));
        component.form.get('message').setValue('');
        expect(component.shouldDisableSubmit()).toBeTruthy();
        component.submit();
        expect(
            component.messagesCoordinatorService.sendMessage,
        ).not.toHaveBeenCalled();
    });
    it('should submit if form is valid and clear input', () => {
        spyOn(
            component.messagesCoordinatorService,
            'sendMessage',
        ).and.returnValue(of(true));
        component.form.get('message').setValue('New chat message');
        expect(component.shouldDisableSubmit()).toBeFalsy();
        component.submit();
        expect(component.form.value.message).toBe(null);
        expect(
            component.messagesCoordinatorService.sendMessage,
        ).toHaveBeenCalled();
    });
    it('should submit if form is valid and handle error', () => {
        const newError = {
            error: {
                code: 500,
                message: 'ups',
                system: 'string',
            },
            status: 500,
        };
        spyOn(
            component.messagesCoordinatorService,
            'sendMessage',
        ).and.returnValue(Observable.throw(newError));
        spyOn((component as any).toastService, 'show');
        component.form.get('message').setValue('New chat message');
        component.submit();
        expect(component.form.value.message).toBe('New chat message');
        expect(
            component.messagesCoordinatorService.sendMessage,
        ).toHaveBeenCalled();
        expect((component as any).toastService.show).toHaveBeenCalled();
    });
    it('formatDate should show today if it is today', () => {
        spyOn((component as any).localiseService, 'fromKey');
        component.formatDate(new Date());
        expect((component as any).localiseService.fromKey).toHaveBeenCalled();
    });
    it('formatDate should show today if it is today', () => {
        const result = component.formatDate(new Date('1989-05-31'));
        expect(result.length).toBeGreaterThan(5);
    });
});
