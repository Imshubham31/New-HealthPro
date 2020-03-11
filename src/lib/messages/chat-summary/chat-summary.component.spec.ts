import { TestHCPs } from './../../../test/support/test-hcps';
import { Chat } from './../chat.model';
import { TestParticipantDetails } from './../../../test/support/test-participant-details';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { ChatSummaryComponent } from './chat-summary.component';
import { TestPatients } from 'test/support/test-patients';
import { LocaliseService } from '@lib/localise/localise.service';
import { TruncatePipe } from '@lib/shared/services/truncate.pipe';

let component: ChatSummaryComponent;
let fixture: ComponentFixture<ChatSummaryComponent>;

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

const mockPatientMap = new Map([['10', TestPatients.build('10')]]);

function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [ChatSummaryComponent],
        providers: [
            {
                provide: LocaliseService,
                useValue: {
                    fromKey: val => val,
                },
            },
            TruncatePipe,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
}

describe('Chat summary component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    beforeEach(() => {
        const drCollins = TestHCPs.createDrCollins();
        AuthenticationService.setUser(drCollins);
        fixture = TestBed.createComponent(ChatSummaryComponent);
        component = fixture.componentInstance;
        component.title = mockChat.subject;
        component.count = mockChat.unreadMessages;
        component.lastMessage = mockChat.messages[mockChat.messages.length - 1];
        component.user = drCollins;
        component.users = mockChat.participants;
        component.patientsMap = mockPatientMap;
        fixture.detectChanges();
    });

    afterEach(() => AuthenticationService.deleteUser());

    describe('mark as read', () => {});

    it('formatDate should work as expected call yesterday', () => {
        spyOn((component as any).localiseService, 'fromKey');
        component.formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 24 hours ago
        expect((component as any).localiseService.fromKey).toHaveBeenCalled();
    });

    it('Get Date Of Birth Suffix should give no value if not in patientsmap', () => {
        expect(component.getDobSuffix('11')).toBe('');
    });
    it('Get Date Of Birth Suffix should give no value if not in patientsmap', () => {
        expect(component.getDobSuffix('10').length).toBeGreaterThan(1);
    });

    it('Check if an id is from a patient based on suffix', () => {
        expect(
            component.isPatient(
                TestParticipantDetails.build('patient-abc-123'),
            ),
        ).toBeTruthy();
        expect(
            component.isPatient(TestParticipantDetails.build('hcp-123-abc')),
        ).toBeFalsy();
    });
});
