import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmenttemplateComponent } from './appointmenttemplate.component';

xdescribe('AppointmenttemplateComponent', () => {
    let component: AppointmenttemplateComponent;
    let fixture: ComponentFixture<AppointmenttemplateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppointmenttemplateComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmenttemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
