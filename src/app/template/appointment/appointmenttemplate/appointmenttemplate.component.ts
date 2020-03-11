import { CreateAppointmentTempState } from './../appointment-temp-form/create-appointmenttemp.state';
import { AppointmentTempFormComponent } from './../appointment-temp-form/appointment-temp-form.component';
import { CareModuleModel } from 'app/patients/add-patient/care-module/care-module.model';
import { DeleteApptemplateComponent } from './../delete-apptemplate/delete-apptemplate.component';
import { ModalService } from './../../../../lib/shared/components/modal/modal.service';
import { AppointmentTemplate } from './../../appointmenttemplate.model';
import { AppointmentService } from './../../appointment.service';
import {
    Component,
    AfterViewInit,
    OnInit,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EditAppointmentTempState } from '../appointment-temp-form/edit-appointmenttemp.state';
import { LocaliseService } from '@lib/localise/localise.service';

@Component({
    selector: 'app-appointmenttemplate',
    templateUrl: './appointmenttemplate.component.html',
    styleUrls: ['./appointmenttemplate.component.scss'],
})
export class AppointmenttemplateComponent
    implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    appointmentList: AppointmentTemplate[];
    showTable: Boolean = false;
    careModulesList: CareModuleModel[];
    private deletetemplate: DeleteApptemplateComponent;
    dtTrigger: Subject<any> = new Subject();
    constructor(
        private appointmentService: AppointmentService,
        private modalService: ModalService,
        private localise: LocaliseService,
    ) {}

    ngOnInit() {
        this.dtOptions = {
            order: [],
            paging: false,
            info: false,
            retrieve: true,
            language: {
                search: '',
                searchPlaceholder: this.localise.fromKey('searchPlaceholder'),
            },
            columnDefs: [{ width: '120px', targets: '4', orderable: false }],
            columns: [null, null, null, null, { orderable: false }],
        };

        AppCoordinator.loadingOverlay.next({ loading: true });
        observableCombineLatest(
            this.appointmentService.getAppointmentTemplate(),
            this.appointmentService.getCaremoduleTitle(),
        )
            .pipe(
                map(([appointmentList, caredModuleList]) => {
                    this.appointmentList = appointmentList;
                    this.careModulesList = caredModuleList;
                    this.showTable = true;
                    this.dtTrigger.next();
                    AppCoordinator.loadingOverlay.next({ loading: false });
                }),
                catchError(err => {
                    AppCoordinator.loadingOverlay.next({ loading: false });
                    return err;
                }),
            )
            .subscribe();
    }

    ngAfterViewInit(): void {}

    rerenderAppointmentTemplate() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }
    deletetemplatemodal(appointmentId) {
        this.deletetemplate = this.modalService.create<
            DeleteApptemplateComponent
        >(DeleteApptemplateComponent, {
            tempId: appointmentId,
        });
        this.deletetemplate.open();
        this.deletetemplate.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.appointmentList.splice(
                    this.appointmentList.findIndex(
                        item => item.id === appointmentId,
                    ),
                    1,
                );
                this.dtTrigger.next();
            });
        });
    }
    startAppointmentCreate() {
        // tslint:disable-next-line: prefer-const
        let addtemplate = this.modalService.create<
            AppointmentTempFormComponent
        >(AppointmentTempFormComponent, {
            state: new CreateAppointmentTempState(this.localise),
            careModulesList: this.careModulesList,
        });
        addtemplate.open();
        addtemplate.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.appointmentList.push(
                    this.appointmentService.newAppointmentTemp,
                );
                this.dtTrigger.next();
            });
        });
    }

    startAppointmentEdit(appointmentTemp: AppointmentTemplate) {
        const editAppointmentTemp = this.modalService.create<
            AppointmentTempFormComponent
        >(AppointmentTempFormComponent, {
            state: new EditAppointmentTempState(this.localise),
            careModulesList: this.careModulesList,
            appointmentTemplate: appointmentTemp,
        });
        editAppointmentTemp.open();
        editAppointmentTemp.onSuccess.subscribe(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                // Call the dtTrigger to rerender again
                this.appointmentList = this.appointmentService.getUpdatedAppointments();
                this.dtTrigger.next();
            });
        });
    }
    getCareModuleTitle(caremoduleId) {
        return this.careModulesList.find(care => care.id === caremoduleId)
            .title;
    }

    ngOnDestroy() {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }
}
