import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import {
    ParticipantType,
    ParticipantsService,
} from '@lib/participants/participants.service';
import { Subscription, combineLatest } from 'rxjs';
import { LocaliseService } from '@lib/localise/localise.service';
import { MdtsService } from 'app/mdts/mdts.service';
import { MDTs } from 'app/mdts/mdts.model';
import { ParticipantDetails } from '@lib/participants/participant-details.model';
import { map } from 'rxjs/operators';
import { Stores } from '@lib/utils/stores';
import {
    TagModelList,
    TagModel,
} from '../modal/multilist-tag-input/multi-list-tag-input.component';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { MdtsHcps } from 'app/patients/patient.model';

@Component({
    selector: 'mdts-participant-multi-selector',
    template: `
        <div
            class="loading"
            *ngIf="this.isFetching; else showParticipants"
        ></div>
        <ng-template #showParticipants>
            <app-modal-multi-list-tag-input
                [optionLists]="this.optionLists"
                [placeholder]="'enterANewHCP' | localise"
                [absolute]="absolute"
                [allowUnknownValues]="true"
                [transformValue]="this.valueTransformer"
                [additionalTagFilter]="this.additionalTagFilter"
                (valueChanged)="this.handleValueChanged($event)"
            >
            </app-modal-multi-list-tag-input>
        </ng-template>
    `,
})
@Unsubscribe()
export class MdtsParticipantMultiSelectorComponent implements OnInit {
    private readonly MDT_TYPE = 'MDT';
    private readonly HCP_TYPE = 'HCP';

    subscriptions: Subscription[] = [];
    isFetching = true;
    mdts: MDTs[];
    hcpParticipants: ParticipantDetails[];
    optionLists: TagModelList[];
    hasMdtSelected = false;

    @Input() absolute = false;
    @Output() valueChanged = new EventEmitter<MdtsHcps>();

    constructor(
        private participantsService: ParticipantsService,
        private mdtsService: MdtsService,
        private localiseService: LocaliseService,
    ) {}

    ngOnInit(): void {
        this.isFetching = true;
        this.participantsService.fetch();
        this.subscriptions = [
            combineLatest([
                this.mdtsService.getMdts$().pipe(
                    map((store: Stores.Store<MDTs>) => {
                        this.mdts = store.list || [];
                        return store.isFetching;
                    }),
                ),
                this.participantsService.isFetching$(),
                this.participantsService
                    .filteredStore$(ParticipantType.HCP)
                    .pipe(
                        map((details: ParticipantDetails[]) => {
                            this.hcpParticipants = details || [];
                            return !details;
                        }),
                    ),
            ]).subscribe((isFetching: boolean[]) => {
                this.isFetching = isFetching.some(x => x);
                if (!this.isFetching) {
                    this.optionLists = this.rebuildOptions();
                }
            }),
        ];
    }

    handleValueChanged(values: TagModel[]): void {
        const hcps = values
            .filter(v => v.type === this.HCP_TYPE)
            .map(v => v.id);
        const res = new MdtsHcps();
        res.sharedMdtIds = values
            .filter(v => v.type === this.MDT_TYPE)
            .map(v => v.id);
        if (hcps.length > 0) {
            res.personalMdt = { hcps };
        }
        this.hasMdtSelected = res.sharedMdtIds.length > 0;
        this.valueChanged.emit(res);
    }
    public get additionalTagFilter(): (_val: TagModel) => boolean {
        return _tag => !this.hasMdtSelected || _tag.type !== this.MDT_TYPE;
    }

    public get valueTransformer(): (_val: MDTs[] | MdtsHcps) => TagModel[] {
        return value => this.parseValue(value);
    }

    private parseValue(updatedValue: MDTs[] | MdtsHcps): TagModel[] {
        if (!updatedValue) {
            return [];
        }
        if (updatedValue instanceof Array) {
            if (updatedValue.length === 0) {
                return [];
            }
            if (
                updatedValue[0] instanceof MDTs ||
                !!(updatedValue[0] as MDTs).id
            ) {
                return this.updatValueMdtsList(updatedValue);
            }
        }
        if (updatedValue instanceof MdtsHcps) {
            return this.updateValueMdtsHcps(updatedValue);
        }
        // to make sure that developer pass the correct data
        throw new Error('trying to set a value of an unknown type');
    }

    private updatValueMdtsList(mdts: MDTs[]): TagModel[] {
        if (mdts.length === 0) {
            return [];
        }
        // if there is a current value given. Push it to the service in correct format
        const values = [
            ...mdts
                .filter(mdt => !mdt.personal)
                .map(mdt => this.mdtToTagModel(mdt)),
            ...mdts
                .filter(mdt => mdt.personal)
                .reduce(
                    (prev: ParticipantDetails[], list: MDTs) =>
                        prev.concat(
                            list.hcps.map(hcp => ParticipantDetails.map(hcp)),
                        ),
                    [],
                )
                .map(hcp => this.hcpToTagModel(hcp)),
        ];
        return values;
    }

    private updateValueMdtsHcps(mdtsHcps: MdtsHcps) {
        if (!this.optionLists) {
            return [];
        }
        const mdtIds = mdtsHcps.sharedMdtIds;
        const hcpIds = mdtsHcps.personalMdt ? mdtsHcps.personalMdt.hcps : null;
        const mdtValues = !mdtIds
            ? []
            : this.optionLists[0].options.filter(option =>
                  mdtIds.some(id => option.id === id),
              );
        const hcpValues = !hcpIds
            ? []
            : this.optionLists[1].options.filter(option =>
                  hcpIds.some(id => option.id === id),
              );
        return [...mdtValues, ...hcpValues];
    }

    private rebuildOptions(): TagModelList[] {
        return [this.createMdtModelList(), this.createHcpModelList()];
    }

    private createMdtModelList(): TagModelList {
        return {
            name: this.localiseService.fromKey('mdts'),
            options: this.mdts.map(mdt => this.mdtToTagModel(mdt)),
            noResultsMsg: (values: TagModel[]) =>
                values.some((v: TagModel) => v.type === this.MDT_TYPE)
                    ? 'youCanOnlyAssignOneMDTAtATime'
                    : 'noResultFound',
        };
    }
    private createHcpModelList(): TagModelList {
        return {
            name: this.localiseService.fromKey('hcps'),
            options: this.hcpParticipants.map(hcp => this.hcpToTagModel(hcp)),
        };
    }
    private mdtToTagModel(mdt: MDTs): TagModel {
        return {
            id: mdt.id,
            name: mdt.name,
            detail: this.localiseService.fromKey('mdt'),
            type: this.MDT_TYPE,
        };
    }
    private hcpToTagModel(hcp: ParticipantDetails): TagModel {
        return {
            id: hcp.backendId,
            name: new RestrictProcessingPipe(this.localiseService).transform(
                hcp,
            ),
            detail: hcp.role,
            type: this.HCP_TYPE,
        };
    }
}
