import { environment } from 'environments/environment';
import { AvatarService } from './avatar.service';
import { BrowserModule } from '@angular/platform-browser';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AVATAR_CACHE } from '@lib/shared/components/avatars/avatar.service';
import * as Cache from 'node-cache';
import { HttpClient } from '@angular/common/http';
import SpyObj = jasmine.SpyObj;

describe('AvatarService', () => {
    let service: AvatarService;
    let httpMock: HttpTestingController;
    let mockCache: SpyObj<Cache>;
    const testId = 'testId';
    const testUrl = `${
        environment.baseUrl
    }/users/${testId}/profile-picture?time=1546344000000`;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BrowserModule],
            providers: [
                HttpClient,
                AvatarService,
                {
                    provide: AVATAR_CACHE,
                    useValue: jasmine.createSpyObj('cache', [
                        'get',
                        'set',
                        'del',
                    ]),
                },
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(AvatarService);
        httpMock = TestBed.get(HttpTestingController);
        mockCache = TestBed.get(AVATAR_CACHE);
        jasmine.clock().mockDate(new Date('2019-01-01T12:00:00Z'));
    });

    afterEach(() => httpMock.verify());

    it('should fetch from the server', () => {
        mockCache.get.and.callFake((key, callback) => {
            callback();
        });
        service.getAvatar(testId).subscribe(url => {
            expect(url['changingThisBreaksApplicationSecurity']).toContain(
                'blob:http://localhost',
            );
            expect(mockCache.set).toHaveBeenCalledWith(testId, url);
        });
        const req = httpMock.expectOne(testUrl);
        expect(req.request.method).toBe('GET');
        req.flush(new Blob());
    });

    it('should get from cache', () => {
        mockCache.get.and.callFake((key, callback) => {
            callback(undefined, {});
        });
        service.getAvatar(testId).subscribe();
        httpMock.expectNone(testUrl);
    });

    it('should bust the cache', () => {
        service.getAvatar(testId, true).subscribe();
        expect(mockCache.del).toHaveBeenCalledWith(testId);
        httpMock.expectOne(testUrl);
    });

    it('should clear cache item', () => {
        service.clearCacheItem(testId);
        expect(mockCache.del).toHaveBeenCalledWith(testId);
    });

    it('should use default avatar on 404', () => {
        mockCache.get.and.callFake((key, callback) => {
            callback();
        });
        service.getAvatar(testId).subscribe(url => {
            // changingThisBreaksApplicationSecurity doesn't exist on the type definition of url so we must access in a type unsafe way
            expect(url['changingThisBreaksApplicationSecurity']).toBe(
                '/assets/Avatar.svg',
            );
            expect(mockCache.set).toHaveBeenCalledWith(testId, url);
        });
        httpMock
            .expectOne(testUrl)
            .flush(null, { status: 404, statusText: 'Image not found' });
    });
});
