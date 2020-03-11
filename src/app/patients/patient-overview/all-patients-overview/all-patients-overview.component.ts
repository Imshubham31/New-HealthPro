import { tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { SearchInputComponent } from '@lib/shared/components/search-input/search-input.component';
import { SortParams } from '@lib/shared/services/sort-on.pipe';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { PatientService } from '../../patient.service';
import { PatientOverview } from '../../view-patient.model';
import { HcpMessagesService } from 'app/messages/messages.service';
import { oc } from 'ts-optchain';

@Component({
    selector: 'all-patients-overview',
    templateUrl: './all-patients-overview.component.html',
    styleUrls: ['./all-patients-overview.component.scss'],
})
@Unsubscribe()
export class AllPatientsOverviewComponent extends VirtualScroll
    implements OnInit {
    @ViewChild('search', { static: true })
    search: SearchInputComponent;
    subscriptions: Subscription[] = [];
    currentPage: 1;
    patients: PatientOverview[];
    get searchFields() {
        return PatientOverview.searchFields;
    }

    sort: SortParams = {
        fields: ['patient.lastName', 'patient.firstName'],
    };

    get sortLabel() {
        if (oc(this.sort).fields[0]() === 'patient.lastName') {
            return this.localiseService.fromKey('lastName');
        } else if (oc(this.sort).fields[0]() === 'patient.firstName') {
            return this.localiseService.fromKey('firstName');
        }
        return this.localiseService.fromKey('sortBy');
    }

    constructor(
        public patientService: PatientService,
        private messagesService: HcpMessagesService,
        public localiseService: LocaliseService,
    ) {
        super();
    }

    ngOnInit() {
        this.loadDetails();
    }

    private loadDetails() {
        AppCoordinator.loadingOverlay.next({
            loading: true,
            message: this.localiseService.fromKey('loadingPatients'),
        });
        this.subscriptions.push(
            combineLatest(
                this.patientService.getPatients$(),
                this.messagesService.fetchItems$(),
                this.patientService.fetchPatients(),
            )
                .pipe(
                    tap(([store]) => {
                        this.patients = store.list.filter(
                            patient =>
                                patient.patient.onboardingState.hasConsented ===
                                true,
                        );
                        AppCoordinator.loadingOverlay.next({ loading: false });
                    }),
                )
                .subscribe(),
        );
    }

    sortOn(field: string, order: string) {
        this.sort = {
            fields: [field],
            order: order,
        };
    }
}
