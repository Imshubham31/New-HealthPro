import { HttpClientModule, HttpRequest } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
    TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import * as T from 'lodash/fp';
import { TestPathways } from '../../test/support/test-pathways';
import { FindOneResponse } from '@lib/jnj-rest/base-rest.service';
import { Pathway } from './pathway.model';
import { PathWayService } from './pathway.service';
import { PathwayUtils } from './pathway-utils';
import { PathwayRestService } from '@lib/pathway/pathway-rest.service';

describe('PathwayService', () => {
    let service: PathWayService;
    let mockBackend: HttpTestingController;

    const pathway = TestPathways.build();

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [PathWayService, PathwayRestService],
        });

        service = TestBed.get(PathWayService);
        mockBackend = TestBed.get(HttpTestingController);
    });

    describe('#fetchPathway(id)', () => {
        let state;

        beforeEach(() => {
            service.fetchPathway(Number(pathway.id)).subscribe();
        });

        describe('when there is no cached value', () => {
            it('should GET the pathway from the pathways endpoint', () => {
                getFetchPathwayTestRequest();
                mockBackend.verify();
            });

            describe('and the request is done', () => {
                beforeEach(() => {
                    respondToFetchPathway();
                    getState();
                });

                it('should add the pathway to the state', () => {
                    expect(state.list).toContain(pathway);
                });
            });
        });

        describe('when there is a cached value', () => {
            beforeEach(() => {
                respondToFetchPathway();
                service.fetchPathway(Number(pathway.id));
            });

            it('should not make a network request', () => {
                mockBackend.expectNone(T);
            });
        });

        function getState() {
            service
                .getPathways$()
                .take(1)
                .subscribe(s => {
                    state = s;
                });
        }
    });

    describe('#moveToNextPhase(pathway)', () => {
        beforeEach(() => {
            service.moveToNextPhase(pathway).subscribe();
        });

        it('should PATCH the pathway sub-phase resource with the completed status and fetch latest pathway', () => {
            getTestRequest().flush({});
            getFetchPathwayTestRequest().flush({ data: pathway });
        });

        function getTestRequest() {
            return mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('PATCH');
                expect(req.url).toContain(`pathways/${pathway.id}`);
                expect(req.body).toEqual({
                    id: pathway.id,
                    currentSubphaseId: '42',
                    currentPhaseId: '2',
                });
                return true;
            });
        }
    });

    describe('#currentPhase', () => {
        beforeEach(() => {
            service.fetchPathway(Number(pathway.id)).subscribe();
            respondToFetchPathway();
        });

        it('should return the pathways current phase', () => {
            expect(PathwayUtils.getCurrentPhase(pathway)).toEqual(
                pathway.phases[0],
            );
        });
    });

    describe('#nextPhase', () => {
        beforeEach(() => {
            service.fetchPathway(Number(pathway.id)).subscribe();
            respondToFetchPathway();
        });

        it('should return the pathways current phase', () => {
            expect(PathwayUtils.getNextPhase(pathway)).toEqual(
                pathway.phases[1],
            );
        });
    });

    describe('#getPathwayById$', () => {
        it('should fetch from the server if not in the store', () => {
            service.store$.next({
                ...service.store$.value,
                list: [],
            });
            service.getPathwayById$(Number(pathway.id)).subscribe();
            getFetchPathwayTestRequest();
            mockBackend.verify();
        });

        it('should get from the store available', () => {
            service.updateStoreWithEntity(pathway);
            service.getPathwayById$(Number(pathway.id)).subscribe(entity => {
                expect(entity).toEqual(pathway);
                mockBackend.expectNone(T);
            });
        });
    });

    function getFetchPathwayTestRequest(): TestRequest {
        return mockBackend.expectOne((req: HttpRequest<any>) => {
            expect(req.method).toEqual('GET');
            expect(req.url).toContain(`pathways/${pathway.id}`);
            return true;
        });
    }

    function respondToFetchPathway() {
        fakeAsync(() => {
            getFetchPathwayTestRequest().flush({
                data: pathway,
            } as FindOneResponse<Pathway>);
        })();
    }
});
