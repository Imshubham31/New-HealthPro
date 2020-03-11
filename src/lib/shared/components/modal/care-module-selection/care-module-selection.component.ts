import { Service } from '@lib/shared/components/modal/service';
import { Component, OnInit, Input } from '@angular/core';
import { CareModulesService } from 'app/patients/add-patient/care-module/caremodules.service';
import { map } from 'rxjs/operators';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';

@Component({
    selector: 'care-module-selection',
    templateUrl: './care-module-selection.component.html',
    styles: [
        `
            .caremodule-option {
                max-height: 50vh;
                overflow: auto;
            }
        `,
    ],
})
@Unsubscribe()
export class CareModuleSelectionComponent implements OnInit {
    @Input() excludeIds: string[] = [];
    subscriptions: Subscription[] = [];
    value: CareModuleModel;
    constructor(
        public service: Service,
        public careModulesService: CareModulesService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.concat(
            this.careModulesService.fetchCareModules$().subscribe(),
            this.service.getValue().subscribe((value: string) => {
                this.getCareModules$().subscribe(careModules => {
                    this.value = careModules.find(
                        careModule => careModule.id === value,
                    );
                    this.service.onChange(this.value);
                });
            }),
        );
    }

    handleChange(event) {
        this.getCareModules$().subscribe(careModules => {
            const match = careModules.find(
                careModule => careModule.id === event.target.value,
            );
            if (!match) {
                return;
            }
            this.value = match;
            this.service.onChange(this.value);
        });
    }

    getCareModules$() {
        return this.careModulesService
            .getCareModules$()
            .pipe(
                map(careModules =>
                    careModules.filter(
                        careModule => !this.excludeIds.includes(careModule.id),
                    ),
                ),
            );
    }
}
