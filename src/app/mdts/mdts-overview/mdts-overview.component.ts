import { Component, OnInit } from '@angular/core';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { MdtsService } from '../mdts.service';
import { MDTs } from '../mdts.model';
import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { tap, catchError, map } from 'rxjs/operators';
import { LocaliseService } from '@lib/localise/localise.service';
import { SortParams } from '@lib/shared/services/sort-on.pipe';
import { Filteritems } from '@lib/shared/services/items-filter.pipe';
import { oc } from 'ts-optchain';
import { MdtsFormComponent } from '../mdts-form/mdts-form.component';
import { CreateMdtsState } from '../mdts-form/create-mdts.state';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Hospital } from '@lib/hospitals/hospital.model';
@Component({
    selector: 'app-mdts-overview',
    templateUrl: './mdts-overview.component.html',
    styleUrls: ['./mdts-overview.component.scss'],
})
@Unsubscribe()
export class MdtsOverviewComponent implements OnInit {
    subscriptions: Subscription[] = [];
    filterItems: Filteritems[];
    hospital: Hospital;
    mdts: MDTs[];
    nestedKey: String = 'hcps';
    filterKeys: Array<any> = ['id'];
    count: number;
    disableSearchCount: Boolean = true;
    sort: SortParams = {
        fields: ['name'],
    };

    constructor(
        public hospitalService: HospitalService,
        public mdtsService: MdtsService,
        private localiseService: LocaliseService,
        private modalService: ModalService,
    ) {}

    ngOnInit() {
        AppCoordinator.loadingOverlay.next({ loading: true });
        this.subscriptions = [
            observableCombineLatest([
                this.mdtsService.getMdts$().pipe(
                    map(store => {
                        this.mdts = store.list;
                        return store.isFetching;
                    }),
                ),
                this.hospitalService
                    .fetchHospital()
                    .pipe(map(hospital => !(this.hospital = hospital))),
            ])
                .pipe(
                    tap((isLoading: boolean[]) => {
                        AppCoordinator.loadingOverlay.next({
                            loading: isLoading.some(x => x),
                        });
                    }),
                    catchError(err => {
                        AppCoordinator.loadingOverlay.next({ loading: false });
                        return err;
                    }),
                )
                .subscribe(() => {}),
        ];
    }

    get searchFields() {
        return MDTs.searchFields;
    }

    get sortLabel() {
        if (oc(this.sort).fields[0]() === 'name') {
            return this.localiseService.fromKey('MdtsName');
        }
        return this.localiseService.fromKey('sortBy');
    }

    sortOn(field: string, order: string) {
        this.sort = {
            fields: [field],
            order: order,
        };
    }

    checked() {
        this.disableSearchCount = this.filterItems.every(
            v => v.checked === false,
        );
        return this.filterItems.filter(item => {
            return item.checked;
        });
    }

    updateFilterItems(results) {
        this.filterItems = [];
        results.map(item => {
            item.hcps.filter(hcp => {
                const index = this.filterItems.findIndex(
                    filterItem => filterItem.value === hcp.id,
                );
                if (index <= -1) {
                    const filterItem: Filteritems = {
                        value: hcp.id,
                        name: hcp.firstName + ' ' + hcp.lastName,
                        checked: false,
                    };
                    this.filterItems.push(filterItem);
                }
                return null;
            });
        });
    }

    startMdtsCreate() {
        const addtemplate = this.modalService.create<MdtsFormComponent>(
            MdtsFormComponent,
            {
                state: new CreateMdtsState(),
            },
        );
        addtemplate.open();
    }

    hcpCount(count: number) {
        this.count = count + 1;
    }
}
