import { combineLatest as observableCombineLatest } from 'rxjs';

import { tap, catchError } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { CreateHcpState } from '../hcp-form/create-hcp.state';
import { EditHcpState } from '../hcp-form/edit-hcp.state';
import { HcpFormComponent } from '../hcp-form/hcp-form.component';
import { Hcp } from '../hcp.model';
import { HcpService } from '../hcp.service';
import { CreateIntegratedHcpState } from '../hcp-form/create-integrated-hcp.state';

@Component({
    selector: 'app-manage-hcp',
    templateUrl: './manage-hcp.component.html',
    styleUrls: ['./manage-hcp.component.scss'],
})
export class ManageHcpComponent extends VirtualScroll implements OnInit {
    @Output() createHcp = new EventEmitter();
    @Output() newHcp = new EventEmitter();
    hcps: Hcp[];
    currentPage = 1;
    get searchFields() {
        return Hcp.searchFields;
    }

    constructor(
        public hcpService: HcpService,
        public hospitalService: HospitalService,
        private modalService: ModalService,
    ) {
        super();
    }

    ngOnInit() {
        AppCoordinator.loadingOverlay.next({ loading: true });
        observableCombineLatest(
            this.hcpService.fetchHcps(),
            this.hospitalService.fetchHospital(),
        )
            .pipe(
                tap(() =>
                    AppCoordinator.loadingOverlay.next({ loading: false }),
                ),
                catchError(err => {
                    AppCoordinator.loadingOverlay.next({ loading: false });
                    return err;
                }),
            )
            .subscribe();
    }

    startHcpCreate() {
        this.modalService
            .create<HcpFormComponent>(HcpFormComponent, {
                state: this.hospitalService.hospital.value.integrated
                    ? new CreateIntegratedHcpState()
                    : new CreateHcpState(),
            })
            .open();
    }

    startHcpEdit(hcp: Hcp) {
        this.modalService
            .create<HcpFormComponent>(HcpFormComponent, {
                state: new EditHcpState(),
                hcp,
            })
            .open();
    }
}
