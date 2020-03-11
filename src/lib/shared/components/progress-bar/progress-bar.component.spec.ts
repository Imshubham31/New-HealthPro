import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

let component: ProgressBarComponent;
let fixture: ComponentFixture<ProgressBarComponent>;

describe('Progress Bar Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ProgressBarComponent],
            providers: [],
        });
        fixture = TestBed.createComponent(ProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('component should initialize', () => {
        expect(component).toBeDefined();
    });
});
