import { TestBed } from '@angular/core/testing';

import { RegistrationCodeService } from './registration-code.service';
import { HttpClientModule } from '@angular/common/http';

describe('RegistrationCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: RegistrationCodeService = TestBed.get(RegistrationCodeService);
    expect(service).toBeTruthy();
  });
});
