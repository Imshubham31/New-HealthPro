import { Service } from '@lib/shared/components/modal/service';
import { Component, OnInit } from '@angular/core';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';
import { Surgery } from 'app/patients/surgery.model';
import { SurgeonsService } from 'app/patients/add-patient/surgery-details/surgeons.service';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Surgeon } from 'app/patients/add-patient/surgery-details/surgeon.model';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';

@Component({
    selector: 'surgery-selection',
    templateUrl: './surgery-selection.component.html',
})
@Unsubscribe()
export class SurgerySelectionComponent implements OnInit {
    subscriptions: Subscription[] = [];
    group = new FormGroup({
        surgeon: new FormControl(),
        startDateTime: new FormControl(),
    });
    constructor(
        public service: Service,
        public surgeonsService: SurgeonsService,
        public hospitalService: HospitalService,
        private restrictProcessingPipe: RestrictProcessingPipe,
    ) {}

    ngOnInit(): void {
        this.subscriptions.concat(
            this.surgeonsService.getSurgeons$().subscribe(),
            this.hospitalService.fetchHospital().subscribe(),
            this.service.getValue().subscribe((value: Surgery) => {
                this.surgeonsService.store$.subscribe(store => {
                    store.isFetching
                        ? this.group
                              .get('surgeon')
                              .disable({ emitEvent: false })
                        : this.group
                              .get('surgeon')
                              .enable({ emitEvent: false });
                    this.group.setValue(
                        {
                            surgeon: value ? value.surgeon : null,
                            startDateTime:
                                value && value.startDateTime
                                    ? new Date(value.startDateTime)
                                    : null,
                        },
                        { emitEvent: false },
                    );
                });
            }),
            this.group.valueChanges.subscribe(value => {
                this.service.onChange(value);
            }),
            this.group.statusChanges.subscribe(status => {
                this.service.setValidationErrors(
                    status === 'INVALID' ? { dateTimePicker: true } : null,
                );
            }),
        );
    }

    get surgeonLabelFormatter() {
        return (surgeon: Surgeon) => {
            return this.restrictProcessingPipe.transform(surgeon);
        };
    }
}
