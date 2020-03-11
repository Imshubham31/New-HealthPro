import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdtsOverviewComponent } from './mdts-overview.component';

xdescribe('MdtsOverviewComponent', () => {
    let component: MdtsOverviewComponent;
    let fixture: ComponentFixture<MdtsOverviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MdtsOverviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MdtsOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
