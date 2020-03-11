import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestEmailService } from './request-email.service';
import { UserRestService } from '@lib/authentication/user-rest.service';

const mockRestService = {
    create: () =>
        Observable.create(observer => observer.next({ message: 'success' })),
};

describe('Request Email Service', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                RequestEmailService,
                { provide: UserRestService, useValue: mockRestService },
            ],
        });
    });

    it('succesfully request a password reset link', async(
        inject(
            [RequestEmailService],
            (requestEmailService: RequestEmailService) => {
                requestEmailService
                    .sendPasswordEmail('test@email.com')
                    .subscribe(res => {
                        expect(res).toEqual({ message: 'success' });
                    });
            },
        ),
    ));
});
