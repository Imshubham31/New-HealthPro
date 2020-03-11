import { TestBed } from '@angular/core/testing';

import { RegistrationRestService } from './registration-rest.service';

xdescribe('RegistrationRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationRestService = TestBed.get(RegistrationRestService);
    expect(service).toBeTruthy();
  });
});
