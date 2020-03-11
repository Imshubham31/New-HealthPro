import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ModalCheckboxComponent } from './checkbox.component';
import { ModalDateTimePickerComponent } from './date-time-picker.component';
import { ModalDatepickerComponent } from './datepicker.component';
import { ModalFormControlComponent } from './form-control/form-control.component';
import { ModalInputComponent } from './input.component';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { ModalService } from './modal.service';
import { ModalSelectComponent } from './select/select.component';
import { ModalTextareaComponent } from './textarea.component';
import { ModalTimepickerComponent } from './timepicker.component';
import { ModalTimeRangeComponent } from './timerange.component';
import { ModalMultiTagInputComponent } from './multi-tag-input/multi-tag-input.component';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { ModalMultiListTagInputComponent } from './multilist-tag-input/multi-list-tag-input.component';

const components = [
    ModalInputComponent,
    ModalFormControlComponent,
    ModalSelectComponent,
    ModalTimepickerComponent,
    ModalTimeRangeComponent,
    ModalDatepickerComponent,
    ModalMultiTagInputComponent,
    ModalMultiListTagInputComponent,
    ModalCheckboxComponent,
    ModalTextareaComponent,
    LanguagePickerComponent,
    ModalDateTimePickerComponent,
];

@NgModule({
    imports: [
        Ng2AutoCompleteModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        LocaliseModule,
        NzDatePickerModule,
    ],
    declarations: [...components],
    exports: [...components, ReactiveFormsModule],
    providers: [ModalService],
})
export class SharedModalComponentsModule {}
