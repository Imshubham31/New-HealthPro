import { PageObject } from 'test/support/page-object';
import { HcpActionsCardComponent } from './hcp-actions-card.component';
import { By } from '../../../../../node_modules/@angular/platform-browser';

export class HcpActionsCardComponentPage extends PageObject<
    HcpActionsCardComponent
> {
    get consentDescription() {
        return this.fixture.debugElement.query(By.css('#consentDescription'));
    }

    get hcpActionsIcon() {
        return this.fixture.debugElement.query(By.css('.hcp-actions-icon'));
    }

    get consentDescriptionText() {
        return this.fixture.debugElement.query(By.css('.status_date span'))
            .nativeElement.innerText;
    }

    get consentDescriptionDate() {
        return this.fixture.debugElement.query(By.css('.status_date p'));
    }
    get consentDescriptionDateText() {
        return this.consentDescriptionDate.nativeElement.innerText;
    }

    get createNewMessageComp() {
        return this.fixture.debugElement.query(By.css('create-new-message'));
    }

    get editProfileLink() {
        return this.fixture.debugElement.query(By.css('#editProfileLink'));
    }

    get createApptLink() {
        return this.fixture.debugElement.query(By.css('#createApptLink'));
    }
}
