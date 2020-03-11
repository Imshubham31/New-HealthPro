import { TestBed } from '@angular/core/testing';

import { CareModulesService } from './caremodules.service';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { TestCareModules } from 'test/support/test-caremodules';
import { CareModuleModel } from './care-module.model';

describe('CareModulesService', () => {
    let service: CareModulesService;
    let hospitalsRestService: SpyObj<HospitalsRestService>;
    const mockCareModule = TestCareModules.build();
    const mockCareModules: CareModuleModel[] = [];
    mockCareModules.push(mockCareModule);
    mockCareModules.push(mockCareModule);

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                CareModulesService,
                {
                    provide: HospitalsRestService,
                    useValue: jasmine.createSpyObj('hospitalsRestService', [
                        'findCareModules',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(CareModulesService);
        hospitalsRestService = TestBed.get(HospitalsRestService);
    });

    describe('#loadCareModules()', () => {
        beforeEach(() => {
            hospitalsRestService.findCareModules.and.returnValue(
                of(mockCareModules),
            );
        });

        it('should fetch the care modules', () => {
            service.fetchCareModules$().subscribe(careModule => {
                expect(careModule[0].id).toBe(mockCareModules[0].id);
            });
            expect(hospitalsRestService.findCareModules).toHaveBeenCalled();
        });

        it('should return the count of careModules', () => {
            service.fetchCareModules$().subscribe();
            service.getCareModuleCount().subscribe(count => {
                expect(count).toBe(mockCareModules.length);
            });
        });
    });
});
