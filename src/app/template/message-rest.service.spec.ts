import { TestBed } from '@angular/core/testing';

import { MessageRestService } from './message-rest.service';

xdescribe('MessageRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MessageRestService = TestBed.get(MessageRestService);
        expect(service).toBeTruthy();
    });
});
