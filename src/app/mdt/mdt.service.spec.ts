import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { Hcp } from '../hcp/hcp.model';
import { HCPRestService } from '../hcp/hcp.rest-service';
import { HcpService } from '../hcp/hcp.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Patient } from '../patients/patient.model';
import { PatientsRestService } from '../patients/patients-rest.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { MDTRestService } from './mdt-rest.service';
import { MDTService } from './mdt.service';
import { of } from 'rxjs';

const mockUser = new User();
mockUser.hospitalId = '1';

const mockPatientOverview = {
    patient: new Patient(),
    hospitalId: '1',
};
mockPatientOverview.patient.backendId = '5';
const mockMDTS = [
    {
        id: '1',
        name: 'First Mdt',
        hospitalId: '2',
        personal: false,
        hcps: [],
    },
];

const assignSuccess = {
    resourceId: mockMDTS[0].id,
};

const mockMdtRestService = {
    find: () => {
        return Observable.create(observer => observer.next({ data: mockMDTS }));
    },
    create: object => of(assignSuccess),
    patch: (id, string) => {
        return Observable.create(observer => observer.next());
    },
};

const mockPatientsRestService = {
    find: () =>
        of({
            data: [
                mockMDTS,
                {
                    id: '2',
                    name: 'Second Mdt',
                    hospitalId: '2',
                    hcps: [],
                },
            ],
        }),
};

let mdtService: MDTService;

describe('MDT Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, LocaliseModule],
            providers: [
                AuthenticationService,
                HcpService,
                HCPRestService,
                MDTService,
                ToastService,
                {
                    provide: PatientsRestService,
                    useValue: mockPatientsRestService,
                },
                { provide: MDTRestService, useValue: mockMdtRestService },
            ],
        });
        AuthenticationService.setUser(mockUser);
        mockMDTS[0].hospitalId = mockUser.hospitalId;
        mdtService = TestBed.get(MDTService);
    });

    it('should assign MDT to patient', done => {
        mdtService
            .assignMdtTo(mockPatientOverview.patient.backendId, mockMDTS[0])
            .subscribe(res => {
                expect(res).toEqual(mockMDTS[0]);
                done();
            });
    });

    it('add hcp to mdt should succeed', done => {
        mdtService.addHcpToMDT(mockMDTS[0], [new Hcp()]).subscribe(res => {
            mdtService.mdtEdited.subscribe(value => {
                expect(value).toBe(mockMDTS[0]);
            });
            done();
        });
    });

    it('update mdt should succeed', done => {
        mdtService.updateMDT(mockMDTS[0]).subscribe(res => {
            mdtService.mdtEdited.subscribe(value => {
                expect(value).toBe(mockMDTS[0]);
            });
            done();
        });
    });
});
