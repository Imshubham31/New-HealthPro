import { TestBed } from '@angular/core/testing';
import { ParticipantsService } from './participants.service';
import { SearchRestService } from '@lib/search/search-rest.service';
import { of, throwError } from 'rxjs';
import { spyOnSubscription } from 'test/support/custom-spies';
import { ParticipantDetails } from './participant-details.model';

describe('ParticipantsService', () => {
    let service: ParticipantsService;
    let searchRestService: SearchRestService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                ParticipantsService,
                {
                    provide: SearchRestService,
                    useValue: {
                        findMessageParticipants: () => of(),
                    },
                },
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.get(ParticipantsService);
        searchRestService = TestBed.get(SearchRestService);
    });
    describe('fetch()', () => {
        it('should subscribe to findMessageParticipants', () => {
            const spy = spyOnSubscription(
                searchRestService,
                'findMessageParticipants',
                of([]),
            );
            service.fetch();
            expect(spy.subscribe).toHaveBeenCalledTimes(1);
        });
        it('should not fetch if already fetching', () => {
            const spy = spyOnSubscription(
                searchRestService,
                'findMessageParticipants',
                of([]),
            );
            service.store$.next({ isFetching: true, list: [] });
            service.fetch();
            expect(spy.subscribe).not.toHaveBeenCalled();
        });
        it('should sort by last name ascending', () => {
            const aParticipant = {
                id: 'a',
                lastName: 'a',
            };
            const bParticipant = {
                id: 'b',
                lastName: 'b',
            };
            spyOn(searchRestService, 'findMessageParticipants').and.returnValue(
                of({ data: [bParticipant, aParticipant] }),
            );
            service.fetch();
            expect(service.store$.value.list[0].lastName).toEqual(
                aParticipant.lastName,
            );
            expect(service.store$.value.list[1].lastName).toEqual(
                bParticipant.lastName,
            );
        });
        it('should parse results as ParticipantDetails objects', () => {
            spyOn(searchRestService, 'findMessageParticipants').and.returnValue(
                of({
                    data: [
                        {
                            id: 'a',
                            lastName: 'a',
                        },
                    ],
                }),
            );
            service.fetch();
            expect(service.store$.value.list[0].constructor.name).toBe(
                ParticipantDetails.name,
            );
        });
        it('should catch errors', () => {
            spyOn(searchRestService, 'findMessageParticipants').and.returnValue(
                throwError('error'),
            );
            service.fetch();
            expect(service.store$.value.errors[0]).toBe('error');
        });
    });
});
