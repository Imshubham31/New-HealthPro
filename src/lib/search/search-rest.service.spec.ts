import { SearchRestService } from './search-rest.service';
import {
    HttpTestingController,
    HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';

describe('SearchRestService', () => {
    let restService: SearchRestService;
    let mockBackend: HttpTestingController;

    const tracer = { data: {} };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [SearchRestService],
        });

        restService = TestBed.get(SearchRestService);
        mockBackend = TestBed.get(HttpTestingController);
    });
    describe('findMessageParticipants', () => {
        it('should find the participants', () => {
            restService
                .findMessageParticipants()
                .take(1)
                .subscribe(response => {
                    expect(response).toBe(tracer as any);
                });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('POST');
                    expect(req.url).toContain(`search/participants`);
                    return true;
                })
                .flush(tracer);
            mockBackend.verify();
        });
    });
});
