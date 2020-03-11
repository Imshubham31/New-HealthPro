import { TestBed } from '@angular/core/testing';

import { MdtsService } from './mdts.service';

xdescribe('MdtsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MdtsService = TestBed.get(MdtsService);
        expect(service).toBeTruthy();
    });
});
