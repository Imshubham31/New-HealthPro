import { tap, flatMap, catchError, switchMap, map } from 'rxjs/operators';
import { PathWayService } from '@lib/pathway/pathway.service';
import { PatientService } from '../../patient.service';
import { Pathway } from '@lib/pathway/pathway.model';
import { PatientOverview } from '../../view-patient.model';
import { EditMdtTeamComponent } from '../../../mdt/edit-mdt-team/edit-mdt-team.component';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { PhaseMoveConfirmationComponent } from '../phase-details/phase-move-confirmation.component';
import { PathwayUtils } from '@lib/pathway/pathway-utils';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { HcpMessagesService } from '../../../messages/messages.service';
import { HospitalService } from '../../../../lib/hospitals/hospital.service';

@Component({
    selector: 'patient-details',
    templateUrl: './patient-details.component.html',
    styleUrls: ['./patient-details.component.scss'],
})
@Unsubscribe()
export class PatientDetailsComponent implements OnInit {
    @ViewChild('editMdt', { static: true }) editMdtModal: EditMdtTeamComponent;
    patient: PatientOverview;
    pathway: Pathway;
    max = 19;
    current = 13;
    subscriptions: Subscription[] = [];
    private loading = true;
    get loading$() {
        return this.pathWayService.store$.pipe(
            map(pathwayStore => {
                return this.loading || pathwayStore.isFetching;
            }),
        );
    }

    constructor(
        private patientService: PatientService,
        private route: ActivatedRoute,
        private pathWayService: PathWayService,
        private modalService: ModalService,
        private messagesService: HcpMessagesService,
        private hospitalService: HospitalService,
    ) {}

    ngOnInit() {
        this.loading = true;
        this.patientService
            .getPatient$(this.route.snapshot.params['id'])
            .pipe(
                catchError(() =>
                    this.patientService.fetchPatientWithId(
                        this.route.snapshot.params['id'],
                    ),
                ),
                switchMap(patient =>
                    combineLatest(
                        this.pathWayService
                            .getPathwayById$(patient.patient.pathwayId)
                            .pipe(tap(pathway => (this.pathway = pathway))),
                        this.setPatientAndHeight(patient),
                        this.messagesService.fetchItems$(),
                        this.hospitalService.fetchHospital(),
                    ),
                ),
            )
            .subscribe(
                () => (this.loading = false),
                () => (this.loading = false),
            );
    }

    confirmMove() {
        const nextPhaseTitle = PathwayUtils.getNextSubPhase(this.pathway).title;
        this.modalService
            .create<PhaseMoveConfirmationComponent>(
                PhaseMoveConfirmationComponent,
                { pathway: this.pathway },
            )
            .start(this.patient, nextPhaseTitle);
    }

    editMdtTeam() {
        this.modalService
            .create<EditMdtTeamComponent>(EditMdtTeamComponent, {
                patient: this.patient,
            })
            .start();
    }

    private setPatientAndHeight(patient: PatientOverview) {
        return this.patientService
            .getPatientLatestHeight(patient.patient.backendId)
            .pipe(
                flatMap(height =>
                    this.patientService
                        .getPatient$(patient.patient.backendId)
                        .pipe(
                            tap(patientOverview => {
                                this.patient = patientOverview;
                                this.patient.patient.height = height.value;
                            }),
                        ),
                ),
            );
    }
}
