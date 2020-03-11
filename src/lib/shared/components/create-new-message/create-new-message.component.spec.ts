import { StartNewConversationComponent } from './../../../messages/start-new-conversation/start-new-conversation.component';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestHCPs } from 'test/support/test-hcps';
import { CreateNewMessageComponent } from './create-new-message.component';

let component: CreateNewMessageComponent;
let fixture: ComponentFixture<CreateNewMessageComponent>;

function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [CreateNewMessageComponent],
        providers: [
            {
                provide: ModalService,
                useValue: {
                    create: () => ({
                        open: () => {},
                    }),
                },
            },
            {
                provide: StartNewConversationComponent,
                useValue: {
                    startWithHcp: hcp => of(hcp),
                },
            },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CreateNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}

describe('Manage Hcp Component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    it('should open new message modal', () => {
        const startHcpSpy = jasmine.createSpy('startWithHcp');
        spyOn((component as any).modalService, 'create').and.returnValue({
            open: () => {},
            startWithHcp: startHcpSpy,
        });
        const testHcp = TestHCPs.build();
        component.showNewMessageModal(testHcp);
        expect((component as any).modalService.create).toHaveBeenCalledWith(
            StartNewConversationComponent,
        );
        expect(startHcpSpy).toHaveBeenCalledWith(testHcp);
    });
});
