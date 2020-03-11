import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestHCPs } from '../../../test/support/test-hcps';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Languages } from '@lib/localise/languages';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { HcpService } from '../hcp.service';
import { CreateHcpState } from './create-hcp.state';
import { EditHcpState } from './edit-hcp.state';
import { HcpFormComponent } from './hcp-form.component';
import { SharedModule } from '@lib/shared/shared.module';
import { of } from 'rxjs';

describe('HcpFormState', () => {
    const mockLang = {
        strings: {
            addHcpToPlatform: 'addHcpToPlatform',
            addHcp: 'addHcp',
            saveChanges: 'saveChanges',
            editHcpsProfile: 'editHcpsProfile',
        },
        dir: 'ltr',
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                LocaliseModule,
                FormsModule,
                ReactiveFormsModule,
                SharedModule,
            ],
            declarations: [HcpFormComponent],
            providers: [
                LocaliseService,
                {
                    provide: Languages,
                    useValue: { mockLang },
                },
                FormBuilder,
                {
                    provide: HcpService,
                    useValue: {
                        createHcp: () => of({}),
                        update: () => of({}),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });

        spyOn(AuthenticationService, 'getUser').and.returnValue({
            hospitalId: 'test',
        });
    });

    describe('CreateHcpState', () => {
        const state = new CreateHcpState();

        beforeEach(() => {
            state.context = TestBed.createComponent(
                HcpFormComponent,
            ).componentInstance;
        });

        it('should get title', () => {
            expect(state.title).toBe(mockLang.strings.addHcpToPlatform);
        });

        it('should get submitButton text', () => {
            expect(state.submitButtonText).toBe(mockLang.strings.addHcp);
        });

        it('should submit', () => {
            const spy = spyOn(state.context, 'finish');
            state.setupForm();
            state.submit();
            expect(spy).toHaveBeenCalled();
            expect(state.context.submitting).toBeFalsy();
        });
    });

    describe('EditHcpState', () => {
        const state = new EditHcpState();

        beforeEach(() => {
            state.context = TestBed.createComponent(
                HcpFormComponent,
            ).componentInstance;
            state.context.hcp = TestHCPs.createDrCollins();
        });

        it('should get title', () => {
            expect(state.title).toBe(mockLang.strings.editHcpsProfile);
        });

        it('should get submitButton text', () => {
            expect(state.submitButtonText).toBe(mockLang.strings.saveChanges);
        });

        it('should submit', () => {
            const spy = spyOn(state.context, 'finish');
            state.setupForm();
            state.submit();
            expect(spy).toHaveBeenCalled();
            expect(state.context.submitting).toBeFalsy();
        });
    });
});
