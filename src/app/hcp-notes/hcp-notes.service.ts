import { Injectable } from '@angular/core';
import { Stores } from '@lib/utils/stores';
import { HcpNote } from './hcp-notes.model';
import { map, concatMap, tap } from 'rxjs/operators';
import { PatientsRestService } from '../patients/patients-rest.service';
import { Observable } from 'rxjs';

@Injectable()
export class HcpNotesService extends Stores.StoreService<HcpNote> {
    constructor(private patientsRestService: PatientsRestService) {
        super();
    }

    getNote$(id: string) {
        return this.store$.pipe(
            map(store => store.list.find(note => note.id === id)),
        );
    }

    recentNotes$(patientId: string, take?: number) {
        return this.store$.pipe(
            map(state =>
                state.list
                    .filter(note => note.patientId === patientId)
                    .sort(
                        (note1, note2) =>
                            note2.updated.datetime.valueOf() -
                            note1.updated.datetime.valueOf(),
                    )
                    .slice(0, take),
            ),
        );
    }

    fetchNotes$(patientId: string): Observable<HcpNote[]> {
        super.setStateFetching();
        return this.patientsRestService.findConsultationNotes(patientId).pipe(
            map(response => response.data.map(note => HcpNote.map(note))),
            map(notes => {
                this.store$.next({
                    ...this.store$.value,
                    list: notes,
                    isFetching: false,
                });
                return notes;
            }),
            super.catchErrorAndReset(),
        );
    }

    createNote(patientId: string, hcpNote: HcpNote) {
        super.setStateFetching();
        return this.patientsRestService
            .createConsultationNote(patientId, hcpNote)
            .pipe(
                concatMap(() => this.fetchNotes$(patientId)),
                super.catchErrorAndReset(),
            );
    }

    updateNote(hcpNote: HcpNote, reason: string) {
        return this.patientsRestService
            .updateConsultationNote(hcpNote, reason)
            .pipe(
                super.catchErrorAndReset(),
                tap(() => {
                    // TODO: updateStoreWithEntity should probably do the merging. Will update during store refactor
                    const foundNote = this.store$.value.list.find(
                        note => note.id === hcpNote.id,
                    );
                    Object.assign(foundNote, hcpNote);
                    foundNote.updated.datetime = new Date();
                    this.updateStoreWithEntity(foundNote);
                }),
            );
    }
}
