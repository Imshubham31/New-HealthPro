import { Masks } from '@lib/utils/masks';
import { ModalInputComponent } from './input.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Service } from './service';

let component: ModalInputComponent;
let fixture: ComponentFixture<ModalInputComponent>;

describe('Modal Checkbox Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ModalInputComponent],
            providers: [Service],
        });
        fixture = TestBed.createComponent(ModalInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should handleChange', () => {
        const service = TestBed.get(Service);
        const spy = spyOn(service, 'onChange');
        component.handleChange({
            target: {
                value: 'test',
            },
        });
        expect(spy).toHaveBeenCalledWith('test');
    });
    it('should ngAfterViewInit with mask', () => {
        component.mask = 'phone';
        const spy = spyOn(Masks, 'phone');
        component.input.nativeElement = 'input';
        component.ngAfterViewInit();
        expect(spy).toHaveBeenCalledWith('input');
    });
});
