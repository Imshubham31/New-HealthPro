import { TestBed } from '@angular/core/testing';

import { AppointmentRestService } from './appointment-rest.service';

xdescribe('AppointmentRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AppointmentRestService = TestBed.get(
            AppointmentRestService,
        );
        expect(service).toBeTruthy();
    });
});
