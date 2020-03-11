import { AuthenticationService } from './../../../authentication/authentication.service';
import { Masks } from './../../../utils/masks';
import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';
import {
    InputWithPencilComponent,
    InputType,
} from '@lib/shared/components/input-with-pencil/input-with-pencil.component';
import { By } from '../../../../../node_modules/@angular/platform-browser';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestHCPs } from 'test/support/test-hcps';
class PageObject {
    component: InputWithPencilComponent;
    constructor(public fixture: ComponentFixture<InputWithPencilComponent>) {
        this.component = fixture.componentInstance;
    }

    get image() {
        return this.fixture.debugElement.query(By.css('img'));
    }

    get input() {
        return this.fixture.debugElement.query(By.css('input'));
    }

    isEnabled() {
        return this.input.nativeElement.disabled === false;
    }

    isFocused() {
        return this.input.nativeElement.disabled === false;
    }

    isImageCheckmark() {
        return (
            this.image.nativeElement.src.indexOf('assets/checkmark.svg') > -1
        );
    }

    isImagePencil() {
        return this.image.nativeElement.src.indexOf('assets/accent.svg') > -1;
    }
}

describe('InputWithPencilComponent', () => {
    let page: PageObject;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule, FormsModule],
            declarations: [InputWithPencilComponent],
            providers: [
                {
                    provide: LocaliseService,
                    useValue: {
                        getLocale: () => 'en',
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        page = new PageObject(
            TestBed.createComponent(InputWithPencilComponent),
        );
        const user = TestHCPs.createDrCollins();
        AuthenticationService.setUser(user);
    });

    describe('triggering edit mode with true', () => {
        beforeEach(() => {
            page.component.triggerEditMode(true);
            page.fixture.detectChanges();
        });

        it('should enable editing', () => {
            expect(page.isEnabled()).toBe(true);
        });

        it('should show checkmark button', () => {
            expect(page.isImageCheckmark()).toBe(true);
        });
    });

    describe('triggering edit mode with false', () => {
        beforeEach(() => {
            page.component.triggerEditMode(false);
            page.fixture.detectChanges();
        });

        it('should enable editing', () => {
            expect(page.input).toBeFalsy();
        });

        it('should show pencil button', () => {
            expect(page.isImagePencil()).toBe(true);
        });
    });

    describe('triggering edit mode with number value set', () => {
        beforeEach(() => {
            page.component.value = 1;
        });

        it('should set value as string', () => {
            page.component.triggerEditMode(true);
            page.fixture.detectChanges();
            expect(page.component.value === '1').toBe(true);
        });

        it('should emit valueChanged', done => {
            page.component.valueChanged.subscribe(val => {
                expect(val).toEqual(1);
                done();
            });
            page.component.triggerEditMode(false);
            page.fixture.detectChanges();
        });
    });

    describe('writeValue', () => {
        it('should set the value', () => {
            page.component.writeValue(1);
            expect(page.component.value).toBe(1);
        });

        it('should handle undefined', () => {
            page.component.writeValue(undefined);
            expect(page.component.value).toBe(undefined);
        });
    });

    describe('For input types', () => {
        it('should use steps mask', done => {
            spyOn(Masks, 'steps').and.callFake(() => {
                done();
            });
            page.component.type = InputType.Steps;
            page.component.triggerEditMode(true);
            page.fixture.detectChanges();
        });

        it('should use feet mask for imperial and height', done => {
            const user = TestHCPs.createDrCollins();
            user.units = 'imperial';
            AuthenticationService.setUser(user);
            spyOn(Masks, 'feet').and.callFake(() => {
                done();
            });
            page.component.type = InputType.Height;
            page.component.triggerEditMode(true);
            page.fixture.detectChanges();
        });

        it('should use metric if type is not set', done => {
            spyOn(Masks, 'metric').and.callFake(() => {
                done();
            });
            page.component.triggerEditMode(true);
            page.fixture.detectChanges();
        });
    });

    describe('registerOnChange', () => {
        it('should fire callback', done => {
            page.component.registerOnChange(done);
        });
    });

    describe('registerOnTouched', () => {
        it('should fire callback', done => {
            page.component.registerOnTouched(done);
        });
    });
});
