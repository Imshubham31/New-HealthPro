import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegistrationComponent } from './manage-registration.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { CommonModule } from '@angular/common';
import { LocaliseModule } from '@lib/localise/localise.module';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesModule } from 'angular-datatables';
import { DatefunctionsPipe } from '@lib/shared/services/datefunctions.pipe';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../registration.service';
import { of } from 'rxjs';

describe('ManageRegistrationComponent', () => {
    let component: ManageRegistrationComponent;
    let fixture: ComponentFixture<ManageRegistrationComponent>;
    const registrationList = [
        {
            patient: {
                id: 'patient-215e7918-7958-4e9c-a634-6fd5057a9b3f',
                dob: '2001-09-06T00:00:00+00:00',
                fullname: 'Self Registered Patient 2',
                email: 'c4t.clients.jnj+selfregistered-dev-2@gmail.com',
                pathwayId: 21,
                createdAt: '2020-02-28T09:29:09+00:00',
            },
            careModule: {
                id: 'fad6e380-83ce-4be9-bd1c-22e9a5b7d402',
                title: 'Gastric Band',
            },
            isChecked: false,
        },
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                LocaliseModule,
                DataTablesModule,
                HttpClientTestingModule,
            ],
            declarations: [ManageRegistrationComponent, DatefunctionsPipe],
            providers: [
                LocaliseService,
                {
                    provide: RegistrationService,
                    useValue: {
                        getRegistrationlist: () => of(registrationList),
                    },
                },
                DataTableDirective,
                HttpClient,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call selectPatient function when checked', () => {
        const event = {
            target: {
                checked: true,
            },
        };
        component.selectPatient(event, 0);
        expect(component.patientReglist[0].isChecked).toBeTruthy();
    });

    it('should call selectPatient function when unchecked', () => {
        const event = {
            target: {
                checked: false,
            },
        };
        component.selectPatient(event, 0);
        expect(component.patientReglist[0].isChecked).toBeFalsy();
    });
});
