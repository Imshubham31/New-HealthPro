import { BarChartComponent } from './bar-chart.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Localise } from '@lib/localise/localise.pipe';
import { SimpleChange } from '@angular/core';

xdescribe('Bar chart Component', () => {
    let component: BarChartComponent;
    let fixture: ComponentFixture<BarChartComponent>;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, ChartsModule],
            declarations: [BarChartComponent],
            providers: [LocaliseService, Localise],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
    });

    it('should setup data', () => {
        component.data.seriesData = [
            {
                label: 0,
                value: 0,
            },
            {
                label: 1,
                value: 1,
            },
        ];
        component.ngOnInit();
        expect(component.barChartData[0].data).toEqual([0, 1]);
        expect(component.barChartLabels).toEqual(['THU', 'THU']);
    });
    it('should detect changes', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        const newData = {
            ...component.data,
            threshold: 'newThreshold',
        };
        spyOn(component as any, 'setupData');
        spyOn((component as any).chart, 'refresh').and.callFake(() => {});
        component.ngOnChanges({
            data: new SimpleChange(component.data, newData, false),
        });
        jasmine.clock().tick(10);
        expect((component as any).setupData).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
    it('should ignore changes if data is the same', () => {
        spyOn(component as any, 'setupData');
        component.ngOnChanges({
            data: new SimpleChange(component.data, component.data, false),
        });
        expect((component as any).setupData).not.toHaveBeenCalled();
    });
});
