import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HCPRestService } from './hcp.rest-service';
import { FindResponse } from '@lib/jnj-rest/base-rest.service';

describe('HCPRestService', () => {
    let restService: HCPRestService;
    let mockBackend: HttpTestingController;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [HCPRestService],
        });
    });

    beforeEach(() => {
        restService = TestBed.get(HCPRestService);
        mockBackend = TestBed.get(HttpTestingController);
    });

    describe('#loadPatientsForHcp(id)', () => {
        const id = '42';
        const tracer: FindResponse<any> = { data: [] };

        let response;

        beforeEach(() => {
            restService
                .loadPatientsForHcp(id)
                .take(1)
                .subscribe(r => {
                    response = r;
                });
        });

        it('should GET the patients for the provided HCP from the patients endpoint', () => {
            getTestRequest();
        });

        it('should return the response data as is', () => {
            getTestRequest().flush(tracer);
            expect(response).toBe(tracer.data);
        });

        function getTestRequest() {
            return mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('GET');
                expect(req.url).toContain(`hcps/${id}/patients`);
                return true;
            });
        }
    });
});
