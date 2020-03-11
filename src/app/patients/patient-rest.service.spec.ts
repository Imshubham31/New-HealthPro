import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';

import { PatientRestService } from './patient-rest.service';

describe('PatientRestService', () => {
    let restService: PatientRestService;
    let mockBackend: HttpTestingController;

    const tracer = { data: {} };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [PatientRestService],
        });

        restService = TestBed.get(PatientRestService);
        mockBackend = TestBed.get(HttpTestingController);
    });

    describe('#deletePatient(email,reason)', () => {
        it('should DELETE patient', () => {
            const email = 'test@test.com';
            const reason = 'reason';

            restService
                .deletePatient(email, reason)
                .take(1)
                .subscribe(response => {
                    expect(response).toBe(tracer as any);
                });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('DELETE');
                    expect(req.url).toContain(`/patient`);
                    expect(req.headers.get('GxP-Modification-Reason')).toBe(
                        reason,
                    );
                    return true;
                })
                .flush(tracer);
            mockBackend.verify();
        });
    });
});
