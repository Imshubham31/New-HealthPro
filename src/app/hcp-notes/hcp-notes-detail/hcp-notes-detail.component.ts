import { switchMap } from 'rxjs/operators';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { HcpNotesService } from 'app/hcp-notes/hcp-notes.service';
import { RestrictProcessingPipe } from './../../../lib/shared/services/restricted-user.pipe';
import { Component, OnInit } from '@angular/core';
import { HcpNote } from '../hcp-notes.model';
import { LocaliseService } from '@lib/localise/localise.service';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { EditHcpNoteState } from '../hcp-note-form/edit-hcp-note.state';
import { HcpNoteFormComponent } from '../hcp-note-form/hcp-note-form.component';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Restrictable } from '@lib/authentication/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Unsubscribe()
@Component({
    selector: 'hcp-notes-detail',
    templateUrl: './hcp-notes-detail.component.html',
    styleUrls: ['./hcp-notes-detail.component.scss'],
})
export class HcpNotesDetailComponent implements OnInit {
    note: HcpNote;
    subscriptions: Subscription[] = [];
    constructor(
        private localise: LocaliseService,
        private datePipe: LocalisedDatePipe,
        private modalService: ModalService,
        private restrictProcessingPipe: RestrictProcessingPipe,
        private hcpNotesService: HcpNotesService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.subscriptions = [
            this.route.params
                .pipe(
                    switchMap(params =>
                        this.hcpNotesService.getNote$(params.noteId),
                    ),
                )
                .subscribe(note => (this.note = note)),
        ];
    }

    createdBy(date: Date, editor: Restrictable) {
        return this.localise.fromParams('consultationNoteCreatedBy', [
            this.datePipe.transform(date.valueOf()),
            this.restrictProcessingPipe.transform(editor),
        ]);
    }

    startEditHcpNote() {
        this.modalService
            .create<HcpNoteFormComponent>(HcpNoteFormComponent, {
                state: new EditHcpNoteState(this.note.patientId, this.note),
            })
            .open();
    }
    get showEditLink() {
        const user = AuthenticationService.getUser();
        return user.backendId === this.note.created.id;
    }
}
