import { CircularProgressComponent } from './circular-progress.component';
import { LocaliseService } from '@lib/localise/localise.service';
import {
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync,
} from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Localise } from '@lib/localise/localise.pipe';
import { CircularProgressService } from './circular-progress.service';
import { CircularProgressEase } from './circular-progress.ease';
import { CircularProgressConfig } from './circular-progress.config';

describe('Circular progress Component', () => {
    let component: CircularProgressComponent;
    let fixture: ComponentFixture<CircularProgressComponent>;

    const spy = jasmine.createSpy().and.returnValue(0);
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, ChartsModule],
            declarations: [CircularProgressComponent],
            providers: [
                LocaliseService,
                Localise,
                {
                    provide: CircularProgressService,
                    useValue: {
                        getTimestamp: spy,
                        getArc: (curr, max, rad, crad, semi) =>
                            `M 0 0 A 0 0 0 0 0 0 0`,
                    },
                },
                {
                    provide: CircularProgressEase,
                    useValue: {
                        easeOutCubic: () => 30,
                    },
                },
                CircularProgressConfig,
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CircularProgressComponent);
        component = fixture.componentInstance;
    });
    it('should set path', () => {
        (component as any)._path = false;
        spyOn((component as any)._renderer, 'setElementAttribute');
        (component as any)._setPath(5);
        expect(
            (component as any)._renderer.setElementAttribute,
        ).not.toHaveBeenCalled();
        (component as any)._path = true;
        (component as any)._setPath(5);
        expect(
            (component as any)._renderer.setElementAttribute,
        ).toHaveBeenCalled();
    });
    it('should animate change', fakeAsync(() => {
        spy.calls.reset();
        (component as any).animationDelay = 10;
        (component as any)._animateChange('a', 30);
        expect(spy).not.toHaveBeenCalled();

        (component as any).animationDelay = 0;
        component.duration = 1;
        (component as any)._animateChange(0, 30);
        tick(15);
        component.duration = -1;
        tick(15);
        expect(spy).toHaveBeenCalled();
    }));
    it('should get path transform', () => {
        component.radius = 50;
        component.semicircle = true;
        component.clockwise = true;
        expect(component.getPathTransform()).toEqual(
            'translate(0, 100) rotate(-90)',
        );
        component.clockwise = false;
        expect(component.getPathTransform()).toEqual(
            'translate(100,100) rotate(90) scale(-1, 1)',
        );
        component.semicircle = false;
        component.clockwise = true;
        expect(component.getPathTransform()).toBeNull();
        component.clockwise = false;
        expect(component.getPathTransform()).toEqual(
            'scale(-1, 1) translate(-100 0)',
        );
    });
    it('should resolve color', () => {
        component.current = 0;
        component.max = 100;
        component.resolveColor('red');
        expect(component.color).toBe('#F7211B');
        component.current = 66;
        component.resolveColor('red');
        expect(component.color).toBe('#FFC200');
        component.current = 67;
        component.resolveColor('red');
        expect(component.color).toBe('#73CD1F');
    });
    it('should handle changes', () => {
        spyOn(component as any, '_animateChange');
        spyOn(component as any, '_setPath');
        component.ngOnChanges({ current: true });
        expect((component as any)._animateChange).toHaveBeenCalled();
        expect((component as any)._setPath).not.toHaveBeenCalled();
        component.ngOnChanges({ current: false });
        expect((component as any)._setPath).toHaveBeenCalled();
    });
    it('should get element height', () => {
        component.responsive = true;
        expect(component._elementHeight).toBeNull();
        component.responsive = false;
        component.radius = 50;
        component.semicircle = true;
        expect(component._elementHeight).toEqual('50px');
        component.semicircle = false;
        expect(component._elementHeight).toEqual('100px');
    });
    it('should get viewBox', () => {
        component.radius = 50;
        component.semicircle = true;
        expect(component._viewBox).toEqual('0 0 100 50');
        component.semicircle = false;
        expect(component._viewBox).toEqual('0 0 100 100');
    });
    it('should get bottom padding', () => {
        component.responsive = false;
        expect(component._paddingBottom).toBeNull();
        component.responsive = true;
        component.semicircle = true;
        expect(component._paddingBottom).toEqual('50%');
        component.semicircle = false;
        expect(component._paddingBottom).toEqual('100%');
    });
});
