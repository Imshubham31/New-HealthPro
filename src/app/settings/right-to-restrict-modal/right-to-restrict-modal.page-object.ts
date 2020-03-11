import { By } from '@angular/platform-browser';
import {
    RightToRestrictModalComponent,
    RightToRestrictReasons,
} from './right-to-restrict-modal.component';
import { PageObject } from '../../../test/support/page-object';

export class RightToRestrictModalComponentPage extends PageObject<
    RightToRestrictModalComponent
> {
    get modal() {
        return this.fixture.debugElement.query(By.css('.modal.active'));
    }
    get modalTitle() {
        return this.fixture.debugElement.query(By.css('#modal-title'))
            .nativeElement.innerHTML;
    }
    get gdprQuestion() {
        return this.fixture.debugElement.query(
            By.css('#rightToRestrictQuestion label'),
        ).nativeElement.innerHTML;
    }
    get rightToRestrictExplanationLabel() {
        return this.fixture.debugElement.query(
            By.css('#rightToRestrictExplanation label'),
        ).nativeElement.innerHTML;
    }
    get rightToRestrictExplanationTextarea() {
        return this.fixture.debugElement.query(
            By.css('#rightToRestrictExplanation textarea'),
        );
    }
    get rightToRestrictExplanationPlaceholder() {
        return this.fixture.debugElement.query(
            By.css('#rightToRestrictExplanation textarea'),
        ).nativeElement.placeholder;
    }
    get submitButton() {
        return this.fixture.debugElement.query(By.css('.btn-primary'));
    }
    getGdprOptionSpan(option: RightToRestrictReasons) {
        return this.fixture.debugElement.query(
            By.css(`#rightToRestrictQuestion #${option} span`),
        );
    }
    getGdprOptionInput(option: RightToRestrictReasons) {
        return this.fixture.debugElement.query(
            By.css(`#rightToRestrictQuestion #${option} input`),
        );
    }
    openModal(): any {
        this.component.open();
        this.fixture.detectChanges();
    }
}
