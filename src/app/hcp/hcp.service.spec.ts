import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TestHCPs } from '../../test/support/test-hcps';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { SharedModule } from '@lib/shared/shared.module';
import { Hcp } from './hcp.model';
import { HcpModule } from './hcp.module';
import { HCPRestService } from './hcp.rest-service';
import { HcpService } from './hcp.service';
import { of, throwError, combineLatest } from 'rxjs';
import { take } from '../../../node_modules/rxjs/operators';

describe('HCP Service', () => {
    const mockBackendId = '1';
    const mockHcp = TestHCPs.createDrCollins();
    const inactiveUser = TestHCPs.build({ id: 'inActive', isActive: false });
    const mockHcpRestService = {
        create: () => of({ message: 'created', resourceId: mockBackendId }),
        find: () => of({ data: [mockHcp, inactiveUser] }),
        findOne: (id: any) => of({ data: mockHcp }),
        patch: (id: any, model: Object) => of({ message: 'created' }),
    };

    let hcpService: HcpService;
    let hcpRestService: HCPRestService;

    configureTestSuite(() => {
        spyOn(AuthenticationService, 'getUser').and.returnValue(mockHcp);
        TestBed.configureTestingModule({
            imports: [HcpModule, LocaliseModule, SharedModule],
            declarations: [],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ToastService,
                LocaliseService,
                HcpService,
                { provide: HCPRestService, useValue: mockHcpRestService },
            ],
        });
    });

    beforeEach(() => {
        hcpService = TestBed.get(HcpService);
        hcpRestService = TestBed.get(HCPRestService);
    });

    it('should create HCP', done => {
        hcpService.createHcp(mockHcp).subscribe(() => {
            hcpService.fetchHcpWithID(mockHcp.backendId).subscribe(next => {
                expect(next.backendId).toBe(mockHcp.backendId);
                done();
            });
        });
    });

    it('should load all HCPs', done => {
        hcpService.fetchHcps().subscribe((hcps: Hcp[]) => {
            expect(hcps[0].backendId).toBe(mockHcp.backendId);
            done();
        });
    });

    it('should all getHCPs$ without inactive', done => {
        combineLatest(
            hcpService.createHcp(mockHcp),
            hcpService.getHCPs$(),
        ).subscribe(([rest, hcps]) => {
            expect(hcps.length).toBe(1);
            done();
        });
    });

    it('should all getHCPs$ with inactive', done => {
        combineLatest(
            hcpService.fetchHcps(),
            hcpService.getHCPs$({ onlyActiveUsers: false }),
        )
            .pipe(take(1))
            .subscribe(([rest, hcps]) => {
                expect(hcps.length).toBe(2);
                done();
            });
    });

    it('should getHcps without logged in user', done => {
        combineLatest(
            hcpService.createHcp(mockHcp),
            hcpService.getHCPs$({ includeLoggedInUser: false }),
        ).subscribe(([rest, hcps]) => {
            expect(hcps.length).toBe(0);
            done();
        });
    });

    it('should fetch HCP', done => {
        combineLatest(
            hcpService.createHcp(mockHcp).toPromise(),
            hcpService.fetchHcpWithID(mockHcp.backendId).toPromise(),
        ).subscribe(([rest, hcp]) => {
            expect(hcp.backendId).toBe(mockHcp.backendId);
            done();
        });
    });

    it('should update a HCP', () => {
        const hcps = [TestHCPs.createDrCollins()];
        spyOn(hcpRestService, 'find').and.returnValue(of({ data: hcps }));
        hcpService.fetchHcps().subscribe(res => {
            const editedHcp = TestHCPs.createDrCollins();
            editedHcp.firstName = 'newName';

            hcpService.update(editedHcp).subscribe(response => {
                expect(response).toBeDefined();
            });
            expect(hcpService.getHcp(editedHcp.backendId).firstName).toBe(
                'newName',
            );
        });
    });

    it('should not update an HCP', () => {
        spyOn(hcpRestService, 'find').and.returnValue(throwError(new Error()));
        hcpService.update(new Hcp()).subscribe(
            response => {},
            error => {
                expect(error).toBeDefined();
            },
        );
    });
});
