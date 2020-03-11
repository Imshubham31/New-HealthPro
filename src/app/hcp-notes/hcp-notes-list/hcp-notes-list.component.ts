import {
    Component,
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { Subscription, combineLatest } from 'rxjs';

import { PatientOverview } from '../../patients/view-patient.model';
import { CreateHcpNoteState } from '../hcp-note-form/create-hcp-note.state';
import { HcpNoteFormComponent } from '../hcp-note-form/hcp-note-form.component';
import { HcpNote } from '../hcp-notes.model';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { HcpNotesService } from '../hcp-notes.service';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'app/patients/patient.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { tap } from 'rxjs/operators';

@Unsubscribe()
@Component({
    selector: 'hcp-notes-list',
    templateUrl: './hcp-notes-list.component.html',
    styleUrls: ['./hcp-notes-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HcpNotesListComponent extends VirtualScroll
    implements AfterContentInit {
    subscriptions: Subscription[] = [];
    notes: HcpNote[] = [];
    patient: PatientOverview;

    constructor(
        private modalService: ModalService,
        public hcpNotesService: HcpNotesService,
        public route: ActivatedRoute,
        private patientService: PatientService,
        private localise: LocaliseService,
        private ref: ChangeDetectorRef,
    ) {
        super();
    }

    ngAfterContentInit(): void {
        AppCoordinator.loadingOverlay.next({
            loading: true,
            message: this.localise.fromKey('loadingConsultaionNotes'),
        });

        combineLatest(
            this.patientService.getPatient$(
                this.route.parent.snapshot.params['id'],
            ),
            this.hcpNotesService.recentNotes$(
                this.route.parent.snapshot.params['id'],
            ),
            this.hcpNotesService.fetchNotes$(
                this.route.parent.snapshot.params['id'],
            ),
            this.patientService.fetchPatientWithId(
                this.route.parent.snapshot.params['id'],
            ),
        )
            .pipe(
                tap(([patient, notes]) => {
                    this.patient = patient;
                    this.notes = notes;
                    super.refreshHeight(); // TODO: This smelly
                    this.ref.detectChanges();
                }),
            )
            .subscribe(
                () => AppCoordinator.loadingOverlay.next({ loading: false }),
                () => AppCoordinator.loadingOverlay.next({ loading: false }),
            );
    }

    getRowLink(note: HcpNote) {
        return [
            `/patients/${this.patient.patient.backendId}/consultation-notes`,
            { outlets: { detail: note.id } },
        ];
    }

    startHcpCreateNote() {
        this.modalService
            .create<HcpNoteFormComponent>(HcpNoteFormComponent, {
                state: new CreateHcpNoteState(this.patient.patient.backendId),
            })
            .open();
    }
}
