import { TestBed } from '@angular/core/testing';
import { HospitalCodeService } from './hospital-code.service';
import { HttpClientModule } from '@angular/common/http';
import { HospitalCodeRestService } from './hospital-code-rest.service';

xdescribe('HospitalCodeService', () => {
  let hospitalCodeRestService: any;
  let hospitalCodeService: any;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ],
    providers: [
      {
        provide: HospitalCodeRestService,
        useValue: jasmine.createSpyObj('hospitalCodeRestService', [
          'getHospitalCodeOptions'
        ]),
      },
      HospitalCodeService
    ]
  }));

  beforeEach(() => {
    hospitalCodeRestService = TestBed.get(HospitalCodeRestService);
    hospitalCodeService = TestBed.get(HospitalCodeService);
  });

  it('should be created', () => {
    const service: HospitalCodeService = TestBed.get(HospitalCodeService);
    expect(service).toBeTruthy();
  });

  it('should verify restService', () => {
    hospitalCodeService.getHospitalCodes();
    expect(hospitalCodeRestService.getHospitalCodeOptions).toHaveBeenCalled();
  });
});
