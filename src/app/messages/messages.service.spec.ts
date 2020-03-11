import { async, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ChatsRestService } from '@lib/messages/chat-rest.service';
import { Chat } from '@lib/messages/chat.model';
import { MessagesRestService } from '@lib/messages/messages-rest.service';
import {
    MessagesService,
    NewConversation,
} from '@lib/messages/messages.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { HcpService } from '../hcp/hcp.service';
import { HcpMessagesService } from './messages.service';
import { PatientService } from '../patients/patient.service';
import { Observable, of } from 'rxjs';
import { TestHCPs } from 'test/support/test-hcps';
import { catchError, take } from 'rxjs/operators';
import { TestPatientOverview } from 'test/support/test-patient-overview';
import { TestParticipantDetails } from 'test/support/test-participant-details';
import {
    ParticipantDetails,
    Relation,
} from '@lib/participants/participant-details.model';

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

const mockChat2: Chat = {
    id: '2',
    subject: 'string',
    participantDetails: [
        TestParticipantDetails.build('12'),
        TestParticipantDetails.build('13'),
    ],
    participants: [
        TestParticipantDetails.build('12'),
        TestParticipantDetails.build('13'),
    ],
    messages: [
        {
            body: 'Message text',
            time: new Date(),
            senderId: '13',
        },
    ],
    unreadMessages: 2,
};
const mockedHcp = TestHCPs.createDrCollins();

const mockPatient = TestPatientOverview.build();
mockPatient.patient.backendId = '11';

const msgRestServiceStub = {
    create: (conversation: any) => of({ chatId: '223' }),
    patch: (id, object) => of(),
    find: params => of({ data: [mockChat, mockChat2] }),
};

const chatRestServiceStub = {
    find: params => of({ data: [mockChat, mockChat2] }),
    patch: (id, object) => of(),
    create: () => of(),
};

const toastStub = {
    show: () => ({ message: 'success' }),
};

const patientServiceMock = {
    fetchPatientWithId: () => of(mockPatient),
    fetchPatients: () => of([mockPatient]),
    getPatient$: () => of(mockPatient),
    getPatients$: () => of({ list: [mockPatient] }),
};

const getHCPSStub = [mockedHcp, mockedHcp];

const hcpServiceMock = {
    fetchHcps: () => of([mockedHcp]),
    getHCPs$: params => of(getHCPSStub),
};

describe('HcpMessagesService', () => {
    let msgService: MessagesService;
    let conv: NewConversation;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [
                { provide: MessagesService, useClass: HcpMessagesService },
                AuthenticationService,
                { provide: MessagesRestService, useValue: msgRestServiceStub },
                { provide: ChatsRestService, useValue: chatRestServiceStub },
                { provide: ToastService, useValue: toastStub },
                { provide: PatientService, useValue: patientServiceMock },
                { provide: HcpService, useValue: hcpServiceMock },
            ],
        });
        conv = {
            senderId: 'ptn-12345443',
            subject: 'Message 1',
            participants: [ParticipantDetails.map(TestHCPs.createDrCollins())],
        };
        msgService = TestBed.get(MessagesService);
        spyOn(AuthenticationService, 'getUser').and.returnValue(
            TestHCPs.createDrCollins(),
        );
    });

    xdescribe('given a success response is received from remote service then', () => {
        it('chat should create and stored locally', async(async () => {
            const testBedService = TestBed.get(MessagesRestService);
            await msgService.create(conv).toPromise();
            testBedService.create(conv).subscribe(success => {
                msgService
                    .getAll$()
                    .pipe(take(1))
                    .subscribe(next => {
                        expect(next.length).toBe(1);
                    });
            });
        }));
    });

    describe('given a failure response is received from remote service then', () => {
        it('chat should not be created', () => {
            const testBedService = TestBed.get(MessagesRestService);
            msgService.store$.next({ ...msgService.store$.value, list: [] });
            spyOn(testBedService, 'create').and.returnValue(
                Observable.create(observer => observer.error({ fail: '' })),
            );
            testBedService.create(conv).subscribe(
                success => {},
                error => {
                    msgService
                        .getAll$()
                        .pipe(take(1))
                        .subscribe(next => {
                            expect(next.length).toBe(0);
                        });
                },
            );
        });
    });

    xdescribe('edit subject', () => {
        const testChat: Chat = {
            id: 12,
            subject: 'subject 123',
            participantDetails: [TestParticipantDetails.build('12')],
            participants: [TestParticipantDetails.build('12')],
            messages: [
                {
                    body: '',
                    time: new Date(),
                    senderId: '1234',
                },
            ],
        };

        it('when service success', () => {
            msgService.editSubject(testChat, 'New subject').subscribe(next => {
                expect(mockChat.subject).toEqual('New subject');
            });
        });
        it('when service fails', () => {
            const testBedService = TestBed.get(ChatsRestService);
            spyOn(testBedService, 'patch').and.returnValue(
                Observable.throw({}),
            );
            msgService
                .editSubject(testChat, 'New subject')
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return err;
                    }),
                )
                .subscribe();
        });
    });

    xdescribe('Fetch messages', () => {
        it('should fetch chats in correct order', () => {
            msgService.fetchItems$().subscribe(next => {
                expect(next.length).toBe(2);
                expect(next[0].id).toBe('2');
            });
        });
    });

    describe('Load messages from user', () => {
        it('should fetch correct chats when needed', () => {
            msgService.store$.next({ isFetching: false, list: [mockChat] });
            msgService.loadMessagesFromUser('11').subscribe(next => {
                expect(next.length).toBe(1);
                expect(next[0].id).toBe('1');
            });
        });
    });

    xdescribe('Load selected chat', () => {
        it('should mark as read', () => {
            msgService.markChatAsRead(mockChat).subscribe(() => {
                expect(mockChat.unreadMessages).toEqual(0);
            });
        });
    });

    xdescribe('sendMessageToThread', () => {
        it('should add message to selected chat', () => {
            msgService
                .sendMessageToChat(
                    {
                        body: 'new content',
                        time: new Date(),
                    },
                    mockChat,
                )
                .subscribe(next => {
                    expect(mockChat.messages.length).toBe(2);
                    expect(mockChat.messages[1].body).toBe('new content');
                });
        });
    });

    describe('disable sending message', () => {
        const mockChatDisabled: Chat = {
            id: '2',
            subject: 'string',
            participantDetails: [],
            participants: [],
            messages: [
                {
                    body: 'Message text',
                    time: new Date(),
                    senderId: '13',
                },
            ],
            unreadMessages: 2,
        };

        it('should disable if one hcp is inActive', () => {
            mockChatDisabled.participantDetails = [
                TestParticipantDetails.build('12'),
                TestParticipantDetails.build('13', false),
            ];
            expect(msgService.hasInactive(mockChatDisabled)).toBe(true);
        });

        it('should disable if hcp is not In MDT', () => {
            mockChatDisabled.participantDetails = [
                TestParticipantDetails.build('12'),
                TestParticipantDetails.build('13', true, Relation.NotInMdt),
            ];
            expect(msgService.hasInvalidRelation(mockChatDisabled)).toBe(true);
        });

        it('should be enabled if all hcps are active', () => {
            mockChatDisabled.participantDetails = [
                TestParticipantDetails.build('12'),
                TestParticipantDetails.build('13'),
            ];
            expect(msgService.hasInactive(mockChatDisabled)).toBe(false);
        });
        it('should be disabled if any participant is restricted', () => {
            const chat = new Chat();
            chat.participantDetails = [
                ParticipantDetails.parse({ isRestricted: true }),
                ParticipantDetails.parse({ isRestricted: false }),
            ];
            expect(msgService.canReply(chat)).toBe(false);
        });
        it('should be disabled if all participants are unrestricted', () => {
            const chat = new Chat();
            chat.participantDetails = [
                ParticipantDetails.parse({ isRestricted: true }),
                ParticipantDetails.parse({ isRestricted: true }),
            ];
            expect(msgService.canReply(chat)).toBe(false);
        });
    });
});
