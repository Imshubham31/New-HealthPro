import { async, TestBed, inject } from '@angular/core/testing';
import { SurgeonsService } from './surgeons.service';
import { HCPRestService } from '../../../hcp/hcp.rest-service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

const mockSurgeons = [
    {
        backendId: '4',
        firstName: 'George',
        lastName: 'Winston',
    },
    {
        backendId: '5',
        firstName: 'Catherine',
        lastName: 'Marston',
    },
];

const mockHcpRestService = {
    find: () => of({ data: mockSurgeons }),
};

const mockUser = new User();
mockUser.hospitalId = '1';

describe('Surgeon Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                SurgeonsService,
                AuthenticationService,
                { provide: HCPRestService, useValue: mockHcpRestService },
            ],
        });
        AuthenticationService.setUser(mockUser);
    });

    it('should load all surgeons', inject(
        [SurgeonsService],
        (surgeonsService: SurgeonsService) => {
            surgeonsService.fetchSurgeons().subscribe(surgeons => {
                expect(surgeons.length).toEqual(2);
                expect(surgeons[0].firstName).toBe('George');
            });
        },
    ));

    it('should retrieve a single surgeon from cache', async(
        inject([SurgeonsService], (surgeonsService: SurgeonsService) => {
            surgeonsService.fetchSurgeons().subscribe(surgeons => {
                const surgeon = surgeonsService.getSurgeon('4');
                expect(surgeon.id).toEqual(mockSurgeons[0].backendId);
                expect(surgeon.firstName).toEqual(mockSurgeons[0].firstName);
                expect(surgeon.lastName).toEqual(mockSurgeons[0].lastName);
            });
        }),
    ));

    it('should not retrieve a invalid surgeon from cache', async(
        inject([SurgeonsService], (surgeonsService: SurgeonsService) => {
            surgeonsService.fetchSurgeons().subscribe(surgeons => {
                const surgeon = surgeonsService.getSurgeon('6');
                expect(surgeon).toBeUndefined();
            });
        }),
    ));
});
