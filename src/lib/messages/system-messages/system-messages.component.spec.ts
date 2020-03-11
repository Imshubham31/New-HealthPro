import { TestHCPs } from './../../../test/support/test-hcps';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { SystemMessagesComponent } from './system-messages.component';
import { Messages } from '../message.model';

let component: SystemMessagesComponent;
let fixture: ComponentFixture<SystemMessagesComponent>;

const mockMessagesAdd: Messages = {
    time: new Date(),
    code: 'ADD_PARTICIPANT',
    params: [
        {
            name: 'REQUESTER_NAME',
            value: 'Mr. add Requester',
        },
        {
            name: 'PARTICIPANT_NAME',
            value: 'Mr. added Participant',
        },
    ],
};

const mockMessagesRemove: Messages = {
    time: new Date(),
    code: 'REMOVE_PARTICIPANT',
    params: [
        {
            name: 'REQUESTER_NAME',
            value: 'Mr. remove Requester',
        },
        {
            name: 'PARTICIPANT_NAME',
            value: 'Mr. removed Participant',
        },
    ],
};

function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [SystemMessagesComponent],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
}

describe('System Messages component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    beforeEach(() => {
        AuthenticationService.setUser(TestHCPs.createDrCollins());
        fixture = TestBed.createComponent(SystemMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(() => AuthenticationService.deleteUser());

    it('check that message is correctly formatted for adding participant', () => {
        component.message = mockMessagesAdd;
        expect(component.formattedMessage).toBeDefined();
        expect(
            component.formattedMessage.startsWith(
                mockMessagesAdd.params[0].value,
            ),
        ).toBeTruthy();
    });

    it('check that message is correctly formatted for removing participant', () => {
        component.message = mockMessagesRemove;
        expect(component.formattedMessage).toBeDefined();
        expect(
            component.formattedMessage.startsWith(
                mockMessagesRemove.params[0].value,
            ),
        ).toBeTruthy();
    });
});
