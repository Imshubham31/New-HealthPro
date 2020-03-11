import { ModalCheckboxComponent } from './checkbox.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Service } from './service';

let component: ModalCheckboxComponent;
let fixture: ComponentFixture<ModalCheckboxComponent>;

describe('Modal Checkbox Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [ModalCheckboxComponent],
            providers: [Service],
        });
        fixture = TestBed.createComponent(ModalCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('component should handleChange', () => {
        const service = TestBed.get(Service);
        const spy = spyOn(service, 'onChange');
        component.handleChange({
            target: {
                checked: 'test',
            },
        });
        expect(spy).toHaveBeenCalledWith('test');
    });
});
