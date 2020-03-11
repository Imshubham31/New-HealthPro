import { ModalTextareaComponent } from './textarea.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Service } from './service';

let component: ModalTextareaComponent;
let fixture: ComponentFixture<ModalTextareaComponent>;

describe('Modal Textarea Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ModalTextareaComponent],
            providers: [Service],
        });
        fixture = TestBed.createComponent(ModalTextareaComponent);
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
});
