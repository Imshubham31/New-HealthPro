import { Service } from '@lib/shared/components/modal/service';
import { ModalMultiTagInputComponent, Keys } from './multi-tag-input.component';
import { TestBed } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';

describe('ModalMultiTagInputComponent', () => {
    let component: ModalMultiTagInputComponent;
    let fixture;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [Service],
            declarations: [ModalMultiTagInputComponent],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ModalMultiTagInputComponent);
        component = fixture.componentInstance;
        component.input = { nativeElement: { focus: () => {} } };
        component.dropdown = { nativeElement: { focus: () => {} } };
        component.service.changeFn = () => {};
        component.labelFormatter = item => item.value;
        component.matchProperty = 'value';
    });
    describe('addTag', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
        });
        it('should add to value array', () => {
            component.addTag(component.options[0]);
            expect(component.value).toEqual([component.options[0]]);
        });
        it('should reset inputText ', () => {
            component.inputText = 'blah';
            component.addTag(component.options[0]);
            expect(component.inputText).toEqual('');
        });
        it('should trigger onChange', done => {
            component.service.onChange = done;
            component.addTag(component.options[0]);
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
            component.addTag(component.options[0]);
        });
        it('should remove from value array if matched', () => {
            component.removeTag(component.options[0]);
            expect(component.value).toEqual([]);
        });
        it('should not remove from value array if no match', () => {
            component.removeTag({ value: 999, label: '999' });
            expect(component.value).toEqual([component.options[0]]);
        });
        it('should trigger onChange', done => {
            component.service.onChange = done;
            component.removeTag(component.options[0]);
        });
    });

    describe('removeLastTag', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
            component.addTag(component.options[0]);
            component.addTag(component.options[1]);
            component.matchProperty = 'value';
        });
        it('should remove last value', () => {
            component.removeLastTag();
            expect(component.value).toEqual([component.options[0]]);
            expect(component.highlightedOptionId).toBeNull();
        });
    });

    describe('dropdownOptions', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
            ];
            component.labelFormatter = item => item.label;
        });
        it('should return all options if none selected with no search input', () =>
            expect(component.dropdownOptions).toEqual(component.options));
        it('should return remaining options if 1 selected with no search input', () => {
            component.addTag(component.options[0]);
            expect(component.dropdownOptions).toEqual([
                component.options[1],
                component.options[2],
            ]);
        });
        it('should return matched options if none selected with search input', () => {
            component.inputText = '1';
            expect(component.dropdownOptions).toEqual([component.options[0]]);
        });
        it('should return remaining matched options if 1 selected with search input', () => {
            component.addTag(component.options[0]);
            component.inputText = '2';
            expect(component.dropdownOptions).toEqual([component.options[1]]);
        });
        it('should return no options and search has no match', () => {
            component.inputText = 'z';
            expect(component.dropdownOptions).toEqual([]);
        });
    });

    describe('handleFocus', () => {
        it('should set focus', () => {
            component.handleFocus();
            expect((component as any).hasFocus).toBe(true);
        });
    });

    describe('handleBlur', () => {
        it('should unset focus', () => {
            component.handleBlur();
            expect((component as any).hasFocus).toBe(false);
        });
    });

    describe('handleInput()', () => {
        it('should update text', () => {
            component.handleInput({ target: { value: 'test' } });
            expect(component.inputText).toBe('test');
            expect(component.backspaceCount).toBe(0);
        });
    });

    describe('handleSelection()', () => {
        it('should add tag', () => {
            component.handleSelection(new Event('click'), 'test');
            expect(component.value).toEqual(['test']);
        });
    });

    describe('highlightFirstOption()', () => {
        it('should highlight the first option', () => {
            component.options = [{ value: 1, label: '1' }];
            component.highlightOption(0);
            expect(component.highlightedOptionId).toEqual(0);
        });
    });

    describe('highlightNextOption()', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
            component.matchProperty = 'value';
        });
        it('should highlight the first option', () => {
            component.highlightNextOption();
            expect(component.highlightedOptionId).toEqual(0);
        });
        it('should highlight the second option', () => {
            component.highlightOption(0);
            component.highlightNextOption();
            expect(component.highlightedOptionId).toEqual(1);
        });
        it('should roundtrip back to first option', () => {
            component.highlightOption(0);
            component.highlightNextOption();
            component.highlightNextOption();
            expect(component.highlightedOptionId).toEqual(0);
        });
    });

    describe('highlightPreviousOption()', () => {
        beforeEach(() => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
            component.matchProperty = 'value';
            component.highlightOption(0);
        });
        afterEach(() => expect(component.highlightedOptionId).toEqual(0));
        it('highlight first: previous and then next', () => {
            component.highlightPreviousOption();
            component.highlightNextOption();
        });
        it('highlight first: next and then previous', () => {
            component.highlightNextOption();
            component.highlightPreviousOption();
        });
        it('highlight first: next and next roundtrip', () => {
            component.highlightNextOption();
            component.highlightNextOption();
        });
        it('highlight first: next and next roundtrip', () => {
            component.highlightPreviousOption();
            component.highlightPreviousOption();
        });
    });

    describe('addOptionAndHighlight()', () => {
        it('should add tag and highlight the first option', () => {
            component.options = [
                { value: 1, label: '1' },
                { value: 2, label: '2' },
            ];
            component.highlightOption(0);
            component.addHighlightedOption();
            expect(component.highlightedOptionId).toBeNull();
        });
    });

    describe('handleKeyup()', () => {
        describe('backspace', () => {
            it('should call removeLastTag', () => {
                const spy = spyOn(component, 'removeLastTag');
                component.inputText = '';
                component.backspaceCount = 1;
                component.handleKeyup(
                    new KeyboardEvent('keyup', {
                        key: Keys.Backspace,
                    }),
                );
                expect(spy).toHaveBeenCalledTimes(1);
            });
            it('should not call removeLastTag if input has text', () => {
                const spy = spyOn(component, 'removeLastTag');
                component.inputText = '1';
                component.backspaceCount = 2;
                component.handleKeyup(
                    new KeyboardEvent('keyup', {
                        key: Keys.Backspace,
                    }),
                );
                expect(spy).not.toHaveBeenCalled();
            });
            it('should not call removeLastTag if backspace count is 0', () => {
                const spy = spyOn(component, 'removeLastTag');
                component.inputText = '';
                component.backspaceCount = 0;
                component.handleKeyup(
                    new KeyboardEvent('keyup', {
                        key: Keys.Backspace,
                    }),
                );
                expect(spy).not.toHaveBeenCalled();
            });
        });
        describe('down arrow', () => {
            it('should call highlightNextOption', () => {
                const spy = spyOn(component, 'highlightNextOption');
                component.handleKeyup(
                    new KeyboardEvent('keyup', {
                        key: Keys.ArrowDown,
                    }),
                );
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
        describe('up arrow', () => {
            it('should call highlightPreviousOption', () => {
                const spy = spyOn(component, 'highlightPreviousOption');
                component.handleKeyup(
                    new KeyboardEvent('keyup', {
                        key: Keys.ArrowUp,
                    }),
                );
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
        describe('enter', () => {
            it('should call addHighlightedOption', () => {
                const spy = spyOn(component, 'addHighlightedOption');
                component.options = [
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                ];
                component.highlightOption(0);
                component.handleKeydown(
                    new KeyboardEvent('keydown', {
                        key: Keys.Enter,
                    }),
                );
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('clickedOutside()', () => {
        beforeEach(() => component.handleFocus());
        it('should not blur if clicked inside', () => {
            fixture.debugElement.nativeElement.click();
            expect(component.hasFocus).toBe(true);
        });
    });

    describe('onClick()', () => {
        beforeEach(() => component.handleBlur());
        it('should focus if not disabled', () => {
            fixture.debugElement.nativeElement.click();
            expect(component.hasFocus).toBe(true);
        });
        it('should not focus if disabled', () => {
            component.disabled = true;
            fixture.debugElement.nativeElement.click();
            expect(component.hasFocus).toBe(false);
        });
    });
});
