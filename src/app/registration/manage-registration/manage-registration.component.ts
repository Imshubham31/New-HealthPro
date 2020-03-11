import { RegistrationService } from './../registration.service';
import { PatientRegistration } from '../patient-registration.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LocaliseService } from '@lib/localise/localise.service';
import { Subject } from 'rxjs';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';

@Component({
    selector: 'app-manage-registration',
    templateUrl: './manage-registration.component.html',
    styleUrls: ['./manage-registration.component.scss'],
})
export class ManageRegistrationComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    patientReglist: PatientRegistration[];
    showTable: Boolean = false;
    toggleButton: Boolean = true;
    selectedRegList: PatientRegistration[];
    constructor(
        private localise: LocaliseService,
        private registrationService: RegistrationService,
    ) {}

    ngOnInit() {
        this.dtOptions = {
            order: [],
            paging: false,
            info: false,
            retrieve: true,
            language: {
                search: '',
                searchPlaceholder: this.localise.fromKey('searchPatient'),
            },
            columnDefs: [
              { orderable: false, targets: 0 },
              { type: 'date', width: '120px', targets: 1 },
              { type: 'date', targets: 6 },
            ]
        };

        AppCoordinator.loadingOverlay.next({ loading: true });

        this.registrationService
            .getRegistrationlist()
            .subscribe(appointments => {
                AppCoordinator.loadingOverlay.next({ loading: false });
                this.patientReglist = appointments;
                this.patientReglist.forEach(patient => {
                    patient.isChecked = false;
                });

                this.showTable = true;
            });
    }
    selectPatient(event, index) {
        this.patientReglist[index].isChecked = event.target.checked;
       this.selectedRegList = this.patientReglist.filter(
            item => item.isChecked === true,
        );

        if (this.selectedRegList.length > 0) {
            this.toggleButton = false;
        } else {
            this.toggleButton = true;
        }
    }
}
