import { StartNewConversationComponent } from '@lib/messages/start-new-conversation/start-new-conversation.component';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ParticipantDetails } from '@lib/participants/participant-details.model';

export class PageObject {
    component: StartNewConversationComponent;
    constructor(
        public fixture: ComponentFixture<StartNewConversationComponent>,
    ) {
        this.component = fixture.componentInstance;
    }
    get page() {
        return this.fixture.debugElement.query(By.css('div[modal-wrapper]'));
    }

    get subjectField() {
        return this.fixture.debugElement.query(By.css('#subject-input'));
    }

    get participantField() {
        return this.fixture.debugElement.query(By.css('participant-selector'));
    }

    get bodyField() {
        return this.fixture.debugElement.query(By.css('#body'));
    }

    get charsRemaining() {
        return this.fixture.debugElement.query(
            By.css('p.characters-remaining'),
        );
    }

    get okButton() {
        return this.fixture.debugElement.query(By.css('button.btn-primary'));
    }

    get participantOptions() {
        return this.fixture.debugElement.query(By.css('.select-option'));
    }

    enterSubject(text) {
        this.component.form.controls['subject'].setValue(text);
        this.component.form.markAsDirty();
        this.fixture.detectChanges();
    }

    enterBody(text) {
        this.component.form.controls['body'].setValue(text);
        this.component.form.markAsDirty();
        this.fixture.detectChanges();
    }

    enterParticipant(hcp: ParticipantDetails) {
        this.component.form.get('participant').setValue(hcp);
        this.component.form.markAsDirty();
        this.fixture.detectChanges();
    }

    submit() {
        this.okButton.nativeElement.click();
        this.fixture.detectChanges();
    }
}
