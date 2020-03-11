import { SplashWrapperComponent } from './splash-wrapper.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';

let component: SplashWrapperComponent;
let fixture: ComponentFixture<SplashWrapperComponent>;

describe('Splash Wrapper Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [SplashWrapperComponent],
            providers: [],
        });
        fixture = TestBed.createComponent(SplashWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('component should initialize', () => {
        expect(component).toBeDefined();
    });
});
