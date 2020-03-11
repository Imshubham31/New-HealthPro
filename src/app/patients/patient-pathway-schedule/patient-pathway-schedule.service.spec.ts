import { TestBed } from '@angular/core/testing';

import { PatientPathwayScheduleService } from './patient-pathway-schedule.service';
import { PatientsRestService } from '../patients-rest.service';
import { TestPathways } from '../../../test/support/test-pathways';
import { TestPatients } from '../../../test/support/test-patients';
import SpyObj = jasmine.SpyObj;
import { TestGoals } from '../../../test/support/test-goals';
import { PathwayRestService } from '../../../lib/pathway/pathway-rest.service';
import { of } from 'rxjs';

describe('Pathway Dates Service', () => {
    let service: PatientPathwayScheduleService;
    let mockPathWayService: SpyObj<PathwayRestService>;

    const pathway = TestPathways.build();
    const mockPatientsRestService = {
        getGoals: () => of([TestGoals.build()]),
    };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientPathwayScheduleService,
                {
                    provide: PathwayRestService,
                    useValue: jasmine.createSpyObj('mockPathWayService', [
                        'findOne',
                        'patch',
                    ]),
                },
                {
                    provide: PatientsRestService,
                    useValue: mockPatientsRestService,
                },
            ],
        });
        service = TestBed.get(PatientPathwayScheduleService);
        mockPathWayService = TestBed.get(PathwayRestService);
    });

    beforeEach(() => {
        mockPathWayService.findOne.and.returnValue(of({ data: pathway }));
        mockPathWayService.patch.and.returnValue(of({}));
    });

    it('should assign correct goals to subphases', () => {
        service
            .getPathwayGoalDates(TestPatients.createEvaGriffiths())
            .subscribe(result => {
                expect(result.phases[0].subphases[0].target).toBe(10);
                expect(result.phases[1].subphases[0].target).toBeNull();
            });
    });

    it('should update pathway schedule', () => {
        service
            .savePathwaySchedule(TestPatients.createEvaGriffiths(), [])
            .subscribe(() => {
                expect(mockPathWayService.patch).toHaveBeenCalled();
            });
    });
});
