import { TestBed } from '@angular/core/testing';
import { HcpNotesService } from '../hcp-notes.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocaliseService } from '@lib/localise/localise.service';
import { CreateHcpNoteState } from 'app/hcp-notes/hcp-note-form/create-hcp-note.state';
import { Languages } from '@lib/localise/languages';
import { HcpNoteFormComponent } from 'app/hcp-notes/hcp-note-form/hcp-note-form.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TestPatients } from 'test/support/test-patients';
import { SharedModule } from '@lib/shared/shared.module';
import { CountdownPipe } from '@lib/shared/services/countdown.pipe';
import { EditHcpNoteState } from './edit-hcp-note.state';
import { TestNotes } from 'test/support/test-notes';

describe('hcpFormState', () => {
    let countdownPipe: CountdownPipe;
    const mockLang = {
        strings: {
            createHcpNote: 'createHcpNote',
            noteTitle: 'noteTitle',
            noteContents: 'noteContents',
            writeConsultationNotes: 'writeConsultationNotes',
            untitled: 'untitled',
            createConsultationNoteError: 'createConsultationNoteError',
            updateConsultationNoteError: 'updateConsultationNoteError',
            editHcpNote: 'editHcpNote',
            saveChanges: 'saveChanges',
            reason: 'reason',
            writeReasonForEditing: 'writeReasonForEditing',
        },
        dir: 'ltr',
    };
    let hcpNotesService: HcpNotesService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [
                LocaliseModule,
                FormsModule,
                ReactiveFormsModule,
                SharedModule,
            ],
            declarations: [HcpNoteFormComponent],
            providers: [
                LocaliseService,
                {
                    provide: Languages,
                    useValue: { mockLang },
                },
                FormBuilder,
                {
                    provide: HcpNotesService,
                    useValue: {
                        createNote: () => of({}),
                        updateNote: () => of({}),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });
    describe('CreateHcpFormState', () => {
        const testPatient = TestPatients.createEvaGriffiths();
        const state = new CreateHcpNoteState(testPatient.backendId);
        beforeEach(() => {
            hcpNotesService = TestBed.get(HcpNotesService);
            state.context = TestBed.createComponent(
                HcpNoteFormComponent,
            ).componentInstance;
            countdownPipe = new CountdownPipe();
        });
        it('should get title', () => {
            expect(state.title).toBe(mockLang.strings.createHcpNote);
        });
        it('should get note title', () => {
            expect(state.context.noteTitle).toBe(mockLang.strings.noteTitle);
        });
        it('should show untitled by default in note title field', () => {
            expect(state.context.untitledPlaceholder).toBe(
                mockLang.strings.untitled,
            );
        });
        it('should get submitButton text', () => {
            expect(state.submitButtonText).toBe(mockLang.strings.createHcpNote);
        });
        it('should submit', () => {
            const spy = spyOn(state.context, 'finish');
            state.setupForm();
            state.submit();
            expect(spy).toHaveBeenCalled();
            expect(state.context.submitting).toBeFalsy();
        });
        it('should handle errors', () => {
            spyOn(hcpNotesService, 'createNote').and.returnValue(
                throwError({}),
            );
            state.setupForm();
            state.submit();
            expect(state.context.errors[0]).toBe(
                mockLang.strings.createConsultationNoteError,
            );
        });
        it('should get note contents label', () => {
            expect(state.context.noteContents).toBe(
                mockLang.strings.noteContents,
            );
        });
        it('should show a placeholder in note contents', () => {
            expect(state.context.notePlaceholder).toBe(
                mockLang.strings.writeConsultationNotes,
            );
        });
        it('should show remaining characters', () => {
            state.setupForm();
            state.context.form.get('body').setValue('hello');
            const bodyLength = state.context.form.value.body;
            const formBodyLength = countdownPipe.transform(bodyLength, 15000);
            expect(formBodyLength).toBe(14995);
        });
    });
    describe('EditHcpFormState', () => {
        const testPatient = TestPatients.createEvaGriffiths();
        const newNote = TestNotes.build();
        const state = new EditHcpNoteState(testPatient.backendId, newNote);
        beforeEach(() => {
            hcpNotesService = TestBed.get(HcpNotesService);
            state.context = TestBed.createComponent(
                HcpNoteFormComponent,
            ).componentInstance;
            countdownPipe = new CountdownPipe();
        });
        it('should get title', () => {
            expect(state.title).toBe(mockLang.strings.editHcpNote);
        });
        it('should get note title', () => {
            expect(state.context.noteTitle).toBe(mockLang.strings.noteTitle);
        });
        it('should show untitled by default in note title field', () => {
            expect(state.context.untitledPlaceholder).toBe(
                mockLang.strings.untitled,
            );
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
        it('should handle errors', () => {
            spyOn(hcpNotesService, 'updateNote').and.returnValue(
                throwError({}),
            );
            state.setupForm();
            state.submit();
            expect(state.context.errors[0]).toBe(
                mockLang.strings.updateConsultationNoteError,
            );
        });
        it('should get note contents label', () => {
            expect(state.context.noteContents).toBe(
                mockLang.strings.noteContents,
            );
        });
        it('should show a placeholder in note contents', () => {
            expect(state.context.notePlaceholder).toBe(
                mockLang.strings.writeConsultationNotes,
            );
        });
        it('should show remaining characters', () => {
            state.setupForm();
            state.context.form.get('body').setValue('hello');
            const bodyLength = state.context.form.value.body;
            const formBodyLength = countdownPipe.transform(bodyLength, 15000);
            expect(formBodyLength).toBe(14995);
        });
    });
});
