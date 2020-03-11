import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Unsubscribe } from '@lib/utils/unsubscribe';
import { HcpNoteFormComponent } from 'app/hcp-notes/hcp-note-form/hcp-note-form.component';
import { CreateHcpNoteState } from 'app/hcp-notes/hcp-note-form/create-hcp-note.state';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { PatientOverview } from '../../patients/view-patient.model';
import { HcpNotesService } from '../hcp-notes.service';

@Component({
    selector: 'patient-details-hcp-notes',
    templateUrl: './patient-details-hcp-notes.component.html',
    styleUrls: ['./patient-details-hcp-notes.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribe()
export class PatientDetailsHcpNotesComponent implements OnInit {
    @Input() patient: PatientOverview;
    private subscriptions: Subscription[] = [];
    constructor(
        public hcpNotesService: HcpNotesService,
        private modalService: ModalService,
    ) {}

    ngOnInit() {
        this.subscriptions.push(
            this.hcpNotesService
                .fetchNotes$(this.patient.patient.backendId)
                .subscribe(),
        );
    }

    startHcpCreateNote() {
        this.modalService
            .create<HcpNoteFormComponent>(HcpNoteFormComponent, {
                state: new CreateHcpNoteState(this.patient.patient.backendId),
            })
            .open();
    }

    get mostRecentNoteLink() {
        return this.hcpNotesService
            .recentNotes$(this.patient.patient.backendId)
            .pipe(
                map(notes => [
                    `/patients/${
                        this.patient.patient.backendId
                    }/consultation-notes`,
                    { outlets: { master: 'all', detail: notes[0].id } },
                ]),
            );
    }
}
