import { MessageService } from './../message.service';
// import { LocaliseService } from '@lib/localise/localise.service';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from './../appointment.service';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
    appointementTemplateCount;
    messageTemplateCount;
    constructor(
        // private localiseService: LocaliseService,
        private appointmentService: AppointmentService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        AppCoordinator.loadingOverlay.next({ loading: true });
        observableCombineLatest(
            this.appointmentService.getAppointmentTemplate(),
            this.messageService.getMessageTemplate(),
        )
            .pipe(
                tap(([appointmentTempaltes, messageTemplates]) => {
                    this.appointementTemplateCount =
                        appointmentTempaltes.length;
                    this.messageTemplateCount = messageTemplates.length;
                    AppCoordinator.loadingOverlay.next({ loading: false });
                }),
            )
            .subscribe();
    }
}
