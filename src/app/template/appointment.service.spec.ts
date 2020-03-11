import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';

xdescribe('AppointmentService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AppointmentService = TestBed.get(AppointmentService);
        expect(service).toBeTruthy();
    });
});
