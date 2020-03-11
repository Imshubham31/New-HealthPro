import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Cache from 'node-cache';

export const AVATAR_CACHE = 'AvatarCache';

@Injectable()
export class AvatarService {
    constructor(
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        @Inject(AVATAR_CACHE) private cache: Cache,
    ) {}

    getAvatar(backendId: string, bustCache = false): Observable<SafeUrl> {
        if (bustCache) {
            this.cache.del(backendId);
            return this.fetchItem(backendId);
        }

        return this.getItem(backendId).pipe(
            catchError(() => this.fetchItem(backendId)),
        );
    }

    clearCacheItem(key: string) {
        this.cache.del(key);
    }

    private getItem(key: string) {
        return Observable.create(observer => {
            this.cache.get(key, (err, value) => {
                err || !value ? observer.error(err) : observer.next(value);
            });
        });
    }

    private fetchItem(backendId: string) {
        return this.http
            .get(
                `${
                    environment.baseUrl
                }/users/${backendId}/profile-picture?time=${this.getCacheBustTime()}`,
                { responseType: 'blob' },
            )
            .pipe(
                map(data => URL.createObjectURL(data)),
                catchError(() => of('/assets/Avatar.svg')),
                map(url => {
                    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
                    this.cache.set(backendId, safeUrl);
                    return safeUrl;
                }),
            );
    }

    // TODO: This needs to be replaced with an etag solution
    private getCacheBustTime() {
        const seconds = 30;
        const time = Date.now();
        const mod = time % (seconds * 1000);
        return time - mod;
    }
}
