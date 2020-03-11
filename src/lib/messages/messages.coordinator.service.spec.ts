import { TestBed } from '@angular/core/testing';
import { Chat } from '@lib/messages/chat.model';
import { MessagesCoordinatorService } from '@lib/messages/messages.coordinator.service';
import { MessagesService } from '@lib/messages/messages.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { of, BehaviorSubject } from 'rxjs';
import { MessagesModule } from '@lib/messages/messages.module';
import SpyObj = jasmine.SpyObj;
import { TestChats } from 'test/support/test-chats';
import { take } from 'rxjs/operators';

describe('MessagesCoordinatorService', () => {
    const mockChat: Chat = TestChats.build({ unreadMessages: 2 });
    let service: MessagesCoordinatorService;
    let modalService: SpyObj<ModalService>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [MessagesModule],
            providers: [
                MessagesCoordinatorService,
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
                {
                    provide: MessagesService,
                    useValue: {
                        store$: new BehaviorSubject<any>({
                            list: [mockChat],
                        }),
                        sendMessageToChat: () => of({}),
                        fetchItems$: () => of([mockChat]),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(MessagesCoordinatorService);
        modalService = TestBed.get(ModalService);
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });

    xdescribe('initialiseState', () => {
        it('should set chats', () => {
            service
                .getSortedChats$()
                .pipe(take(1))
                .subscribe(chats => {
                    expect(chats.length).toBe(1);
                });
        });

        it('should set chats for a patient', () => {
            service
                .getSortedChats$(mockChat.participantDetails[0].backendId)
                .pipe(take(1))
                .subscribe(chats => {
                    expect(chats.length).toBe(1);
                });
        });
    });

    xdescribe('sendMessage', () => {
        it('valid messages message should be sent', () => {
            const testBedService = TestBed.get(MessagesService);
            const spy = spyOn(
                testBedService,
                'sendMessageToChat',
            ).and.callThrough();
            service.sendMessage(mockChat, 'new message');
            expect(spy).toHaveBeenCalled();
        });
    });

    xdescribe('showStartNewConversationModal', () => {
        it('should open modal', () => {
            modalService.create.and.returnValue({
                open: () => {},
            });
            service.showStartNewConversationModal();
            expect(modalService.create).toHaveBeenCalled();
        });
    });

    describe('showEditChatSubject', () => {
        it('should open modal', () => {
            modalService.create.and.returnValue({
                start: () => {},
            });
            service.showEditChatSubject(mockChat);
            expect(modalService.create).toHaveBeenCalled();
        });
    });

    xdescribe('message sorting', () => {
        it('should show new messages top', done => {
            const readChat = TestChats.build({
                id: '1',
                unreadMessages: 0,
            });
            const unreadChat = TestChats.build({
                id: '2',
                unreadMessages: 1,
            });
            const testChats = [readChat, unreadChat];
            const messagesService = TestBed.get(MessagesService);
            const spy = spyOn(messagesService, 'fetchItems$');
            spy.and.returnValue(of(testChats));
            messagesService.store$.next({ list: testChats });
            service
                .getSortedChats$(testChats[0].participantDetails[0].backendId)
                .subscribe(chats => {
                    expect(chats[0].id).toEqual(unreadChat.id);
                    expect(chats[0].unreadMessages).toEqual(
                        unreadChat.unreadMessages,
                    );
                    expect(chats[1].id).toEqual(readChat.id);
                    expect(chats[1].unreadMessages).toEqual(
                        readChat.unreadMessages,
                    );
                    done();
                });
        });

        it('should sort chronologically by messages', done => {
            const chatForToday = TestChats.build({
                id: '1',
            });
            const chatForYesterday = TestChats.build({
                id: '2',
                time: new Date(),
            });
            const testChats = [chatForYesterday, chatForToday];
            const messagesService = TestBed.get(MessagesService);
            const spy = spyOn(messagesService, 'fetchItems$');
            spy.and.returnValue(of(testChats));
            messagesService.store$.next({ list: testChats });
            service
                .getSortedChats$(testChats[0].participantDetails[0].backendId)
                .subscribe(chats => {
                    expect(chats[0].id).toEqual(chatForToday.id);
                    done();
                });
        });
    });
});
