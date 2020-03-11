import { EditPatientComponent } from './edit-patient.component';
import { By } from '@angular/platform-browser';
import { PageObject } from 'test/support/page-object';

export class EditPatientComponentPage extends PageObject<EditPatientComponent> {
    get surgeon() {
        return this.fixture.debugElement.query(
            By.css(
                'app-modal-form-control[formControlName="surgeon"] app-modal-select',
            ),
        );
    }
}
