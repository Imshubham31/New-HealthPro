import { UserRestService } from '@lib/authentication/user-rest.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserPrivacyService } from './user-privacy.service';

describe('UserPrivacyService', () => {
    let restService: UserRestService;
    let service: UserPrivacyService;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [UserRestService, UserPrivacyService],
        });
        restService = TestBed.get(UserRestService);
        service = TestBed.get(UserPrivacyService);
    });

    describe('exports user data', () => {
        it('should POST to the export data endpoint', () => {
            const spy = spyOn(restService, 'create').and.callThrough();
            service.exportData$();
            expect(spy).toHaveBeenCalledWith({}, { subPath: '/gdpr/export' });
        });
    });

    describe('exercise right to be forgotten user data', () => {
        it('should POST to the be forgotten endpoint', () => {
            const spy = spyOn(restService, 'create').and.callThrough();
            service.beForgotten$();
            expect(spy).toHaveBeenCalledWith({}, { subPath: '/gdpr/forget' });
        });
    });
});
