import { TestBed } from '@angular/core/testing';

import { MdtsRestService } from './mdts-rest.service';

xdescribe('MdtsRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MdtsRestService = TestBed.get(MdtsRestService);
        expect(service).toBeTruthy();
    });
});
