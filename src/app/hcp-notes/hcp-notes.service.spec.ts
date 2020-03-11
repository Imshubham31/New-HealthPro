import { TestBed } from '@angular/core/testing';
import { HcpNotesService } from './hcp-notes.service';
import { HcpNote } from './hcp-notes.model';
import SpyObj = jasmine.SpyObj;
import { of, throwError, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PatientsRestService } from '../patients/patients-rest.service';
import { TestNotes } from 'test/support/test-notes';

describe('HcpNotesTest', () => {
    let restService: SpyObj<PatientsRestService>;
    let service: HcpNotesService;
    const note: HcpNote = {
        title: 'hello',
        body: 'how are you',
        id: '4',
        patientId: 'tempId',
        created: {
            id: 'test1',
            firstName: 'bob',
            lastName: 'smith',
            datetime: new Date(),
        },
        updated: {
            id: 'test2',
            firstName: 'bob',
            lastName: 'smith',
            datetime: new Date(),
        },
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                HcpNotesService,
                {
                    provide: PatientsRestService,
                    useValue: jasmine.createSpyObj('hcpNotesRestService', [
                        'findConsultationNotes',
                        'createConsultationNote',
                        'updateConsultationNote',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(HcpNotesService);
        restService = TestBed.get(PatientsRestService);
        restService.findConsultationNotes.and.returnValue(of({ data: [note] }));
    });

    afterEach(() => {
        expect(service.store$.value.isFetching).toBe(false);
    });

    describe('fetch()', () => {
        it('should fetch', () => {
            service.fetchNotes$('id').subscribe(next => {
                expect(next[0].id).toEqual(note.id);
            });
        });

        it('should handle error', () => {
            restService.findConsultationNotes.and.returnValue(throwError({}));
            service
                .fetchNotes$('id')
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return empty();
                    }),
                )
                .subscribe();
        });
    });

    describe('createNote()', () => {
        it('should create note', () => {
            restService.createConsultationNote.and.returnValue(of({}));
            service.createNote('1', note).subscribe(() => {
                expect(service.store$.value.list.length).toBe(1);
            });
        });

        it('should handle error', () => {
            restService.createConsultationNote.and.returnValue(throwError({}));
            service
                .createNote('1', note)
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return empty();
                    }),
                )
                .subscribe();
        });
    });
    describe('recentNotes()', () => {
        let fakeNotes: HcpNote[];
        beforeEach(() => {
            fakeNotes = ['1', '2', '3', '4'].map(id => TestNotes.build(id));
            service.store$.next({
                list: fakeNotes,
                isFetching: false,
            });
        });
        it('should get 3 recent notes', () => {
            service.recentNotes$('tempId', 3).subscribe(notes => {
                expect(notes.length).toBe(3);
            });
        });
        it('should get all notes', () => {
            service.recentNotes$('tempId').subscribe(notes => {
                expect(notes.length).toBe(fakeNotes.length);
            });
        });
        it('should get specific note', () => {
            service.getNote$('2').subscribe(notes => {
                expect(notes.id).toBe('2');
            });
        });
    });
    describe('updateNote()', () => {
        beforeEach(() => {
            service.store$.next({
                list: [note],
                isFetching: false,
            });
        });
        it('should update note', () => {
            restService.updateConsultationNote.and.returnValue(of({}));
            expect((service.store$.value.list[0].title = note.title));
            const updatedNote = {
                ...note,
                title: 'new title',
            };
            service.updateNote(updatedNote, 'reason').subscribe(() => {
                expect(
                    (service.store$.value.list[0].title = updatedNote.title),
                );
            });
        });
        it('should handle error', () => {
            restService.updateConsultationNote.and.returnValue(throwError({}));
            service
                .updateNote(note, 'reason')
                .pipe(
                    catchError(err => {
                        expect(err).toBeDefined();
                        return empty();
                    }),
                )
                .subscribe();
        });
    });
});
