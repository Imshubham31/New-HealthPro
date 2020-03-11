import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AddPhoneComponent } from './add-phone.component';
import { MfaHelpers } from 'test/support/mfa.helpers';

describe('AddPhoneComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            ...MfaHelpers.emailPhoneTestingConfig,
            declarations: [
                ...MfaHelpers.emailPhoneTestingConfig.declarations,
                AddPhoneComponent,
            ],
        }).compileComponents();
    }));

    MfaHelpers.executeEmailPhoneEntryTests(
        TestBed,
        AddPhoneComponent,
        'updateMfaOption',
        'goToEnterCode',
    );

    describe('test validations', () => {
        let component: any;
        let fixture: ComponentFixture<AddPhoneComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(AddPhoneComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
        it('should be invalid when phone is empty', () => {
            expect(component.form.valid).toBeFalsy();
        });

        it('should valid phone properly', () => {
            const phone = component.form.controls['phone'];
            expect(component.form.valid).toBeFalsy();
            expect((phone.errors || {})['required']).toBeTruthy();
            expect((phone.errors || {})['pattern']).toBeFalsy();
            phone.setValue('+14155552671');
            expect(component.form.valid).toBeTruthy();
            expect((phone.errors || {})['required']).toBeFalsy();
            expect((phone.errors || {})['pattern']).toBeFalsy();
            phone.setValue('12');
            expect((phone.errors || {})['required']).toBeFalsy();
            expect((phone.errors || {})['pattern']).toBeTruthy();
            expect(component.form.valid).toBeFalsy();
        });
    });
});
