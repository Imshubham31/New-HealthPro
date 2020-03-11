import { AddEmailComponent } from './add-email.component';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { MfaHelpers } from 'test/support/mfa.helpers';

describe('AddEmailComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            ...MfaHelpers.emailPhoneTestingConfig,
            declarations: [
                ...MfaHelpers.emailPhoneTestingConfig.declarations,
                AddEmailComponent,
            ],
        }).compileComponents();
    }));

    MfaHelpers.executeEmailPhoneEntryTests(
        TestBed,
        AddEmailComponent,
        'updateMfaOption',
        'goToEnterCode',
    );

    describe('test validations', () => {
        let component: any;
        let fixture: ComponentFixture<AddEmailComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(AddEmailComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should valid email properly', () => {
            const email = component.form.controls['email'];
            email.setValue('');
            expect(component.form.valid).toBeFalsy();
            expect((email.errors || {})['required']).toBeTruthy();
            email.setValue('test@test.com');
            expect(component.form.valid).toBeTruthy();
            expect((email.errors || {})['required']).toBeFalsy();
            expect((email.errors || {})['email']).toBeFalsy();
            email.setValue('test@test.com/other@email.com');
            expect((email.errors || {})['required']).toBeFalsy();
            expect((email.errors || {})['email']).toBeTruthy();
            expect(component.form.valid).toBeFalsy();
        });
    });
});
