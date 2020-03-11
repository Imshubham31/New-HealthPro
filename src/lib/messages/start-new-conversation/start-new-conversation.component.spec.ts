import { ModalWrapperComponent } from './../../shared/components/modal-wrapper/modal-wrapper.component';
import { CountdownPipe } from './../../shared/services/countdown.pipe';
import { NO_ERRORS_SCHEMA, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { MessagesService } from '@lib/messages/messages.service';
import { StartNewConversationComponent } from '@lib/messages/start-new-conversation/start-new-conversation.component';
import { PageObject } from '@lib/messages/start-new-conversation/start-new-conversation.component.page-object';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { TestHCPs } from 'test/support/test-hcps';

import { async, TestBed } from '../../../../node_modules/@angular/core/testing';
import { of, throwError } from '../../../../node_modules/rxjs';

import SpyObj = jasmine.SpyObj;

import { Component } from '@angular/core';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

@Component({
    selector: 'participant-selector',
    template: `
        <p>participant-selector</p>
    `,
})
export class MockParticipantSelectorComponent {}

@Component({
    selector: 'app-modal-select',
    template: `
        <p></p>
    `,
})
class MockModalSelectComponent {
    @Input() options;
    @Input() labelFormatter;
}

xdescribe('StartNewConversationComponent', () => {
    let page: PageObject;
    let messagesService: SpyObj<MessagesService>;
    let toastService: SpyObj<ToastService>;
    let localiseService: LocaliseService;
    const mockHCPs = [TestHCPs.createDrCollins()];
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [
                StartNewConversationComponent,
                MockParticipantSelectorComponent,
                CountdownPipe,
                MockModalSelectComponent,
                ModalWrapperComponent,
            ],
            providers: [
                FormBuilder,
                LocaliseService,
                {
                    provide: MessagesService,
                    useValue: jasmine.createSpyObj('messagesService', [
                        'loadPossibleParticipants',
                        'create',
                    ]),
                },
                {
                    provide: ToastService,
                    useValue: jasmine.createSpyObj('toastService', ['show']),
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        page = new PageObject(
            TestBed.createComponent(StartNewConversationComponent),
        );
        messagesService = TestBed.get(MessagesService);
        messagesService.create.and.returnValue(of({}));
        toastService = TestBed.get(ToastService);
        localiseService = TestBed.get(LocaliseService);
        AuthenticationService.setUser(TestHCPs.createDrCollins());
    });

    afterEach(() => AuthenticationService.deleteUser());

    describe('unit', () => {
        it('start with hcp', () => {
            page.component.startWithHcp(mockHCPs[0]);
            expect(page.component.form.get('participant').value).toEqual(
                ParticipantDetails.map(mockHCPs[0]),
            );
        });

        it('should not submit until valid', () => {
            page.component.setupForm();
            page.component.submit();
            page.enterSubject('test');
            expect(messagesService.create).not.toHaveBeenCalled();
            page.enterBody('test');
            page.component.submit();
            expect(messagesService.create).not.toHaveBeenCalled();
            page.enterParticipant(ParticipantDetails.map(mockHCPs[0]));
            page.component.submit();
            expect(messagesService.create).toHaveBeenCalled();
        });

        it('should setup form', () => {
            expect(page.component.form).toBeUndefined();
            page.component.setupForm();
            expect(page.component.form).toBeTruthy();
        });
    });

    describe('behaviours', () => {
        beforeEach(() => {
            page.component.open();
        });
        it('should be a modal', () => {
            expect(page.page).toBeTruthy();
        });

        describe('subject field', () => {
            it('should be visibile', () => {
                expect(page.subjectField).toBeTruthy();
            });

            it('should accept no more than 48 characters', async(() => {
                page.enterSubject(
                    Array(47)
                        .fill('a')
                        .join(''),
                );
                expect(page.component.form.controls['subject'].invalid).toBe(
                    false,
                );
                page.enterSubject(
                    Array(49)
                        .fill('a')
                        .join(''),
                );
                expect(page.component.form.controls['subject'].invalid).toBe(
                    true,
                );
            }));
        });

        describe('participant field', () => {
            describe('when loaded', () => {
                beforeEach(async(() => {
                    page.fixture.detectChanges();
                }));

                it('should be visibile', () => {
                    expect(page.participantField).toBeTruthy();
                });
            });
        });

        describe('messages field', () => {
            it('should be visibile', () => {
                expect(page.bodyField).toBeTruthy();
            });

            it('should accept no more than 240 characters', async(() => {
                page.enterBody(
                    Array(240)
                        .fill('a')
                        .join(''),
                );
                expect(page.component.form.controls['body'].invalid).toBe(
                    false,
                );
                page.enterBody(
                    Array(241)
                        .fill('a')
                        .join(''),
                );
                expect(page.component.form.controls['body'].invalid).toBe(true);
            }));

            it('should update character remain count on text entry', () => {
                const len = 10;
                page.enterBody(
                    Array(len)
                        .fill('a')
                        .join(''),
                );
                expect(
                    Number(page.charsRemaining.nativeElement.innerHTML),
                ).toBe(page.component.maxbodyLength - len);
            });
        });

        describe('cancel button', () => {
            it('should close modal and reset fields', () => {
                page.component.close();
                expect(page.component.submitting).toBe(false);
                expect(page.component.form.pristine).toBe(true);
                expect(page.component.form.value.subject).toBe(null);
                expect(page.component.form.value.participant).toBe(null);
                expect(page.component.form.value.body).toBe(null);
            });
        });

        // TODO: These tests are constantly restarting. Need to figure it out
        xdescribe('start conversation button', () => {
            beforeEach(() => {
                page.fixture.detectChanges();
            });
            it('should be disabled until valid', () => {
                expect(page.okButton.nativeElement.disabled).toBe(true);
                page.enterSubject('test');
                expect(page.okButton.nativeElement.disabled).toBe(true);
                page.enterBody('test');
                expect(page.okButton.nativeElement.disabled).toBe(true);
                page.enterParticipant(ParticipantDetails.map(mockHCPs[0]));
                expect(page.okButton.nativeElement.disabled).toBe(false);
            });

            it('should submit and close modal', () => {
                const closeSpy = spyOn(page.component, 'close');
                page.enterSubject('test');
                page.enterBody('test');
                page.enterParticipant(ParticipantDetails.map(mockHCPs[0]));
                page.submit();
                expect(messagesService.create).toHaveBeenCalledWith({
                    senderId: AuthenticationService.getUser().backendId,
                    subject: 'test',
                    body: 'test',
                    participants: [ParticipantDetails.map(mockHCPs[0])],
                });
                expect(toastService.show).toHaveBeenCalledWith(
                    null,
                    localiseService.fromKey('messageCreated'),
                );
                expect(closeSpy).toHaveBeenCalled();
            });

            it('should submit with error', () => {
                messagesService.create.and.returnValue(throwError({}));
                const closeSpy = spyOn(page.component, 'close');
                page.enterSubject('test');
                page.enterBody('test');
                page.enterParticipant(ParticipantDetails.map(mockHCPs[0]));
                page.submit();
                expect(messagesService.create).toHaveBeenCalled();
                expect(toastService.show).toHaveBeenCalledWith(
                    null,
                    localiseService.fromKey('messageNotCreated'),
                    ToastStyles.Error,
                );
                expect(closeSpy).not.toHaveBeenCalled();
            });
        });
    });
});
