import { Service } from '@lib/shared/components/modal/service';
import { TestBed } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import {
    ModalMultiListTagInputComponent,
    Keys,
} from './multi-list-tag-input.component';

describe('ModalMultiListTagInputComponent', () => {
    let component: ModalMultiListTagInputComponent;
    let fixture;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            providers: [Service],
            declarations: [ModalMultiListTagInputComponent],
        });
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ModalMultiListTagInputComponent);
        component = fixture.componentInstance;
        component.input = { nativeElement: { focus: () => {} } };
        component.dropdown = { nativeElement: { focus: () => {} } };
        component.optionLists = [
            {
                name: 'mdt',
                options: [
                    { id: 'mdt-1', name: '1', detail: 'bla', type: 'mdt' },
                    { id: 'mdt-2', name: '2', detail: 'ble', type: 'mdt' },
                ],
            },
            {
                name: 'hcp',
                options: [
                    { id: 'hcp-1', name: '1', detail: 'bla', type: 'hcp' },
                    { id: 'hcp-2', name: '2', detail: 'ble', type: 'hcp' },
                ],
            },
        ];
    });
    describe('addTag', () => {
        beforeEach(() => {
            component.values = [];
        });
        it('should add to value array', () => {
            component.addTag(component.optionLists[0].options[0]);
            expect(component.values).toEqual([
                component.optionLists[0].options[0],
            ]);
        });
        it('should reset inputText ', () => {
            component.inputText = '1';
            component.addTag(component.optionLists[0].options[0]);
            expect(component.inputText).toEqual('');
            expect(component.values.length).toEqual(1);
        });
        it('should not add tag if custom method prevents ', () => {
            component.additionalTagFilter = _tag => false;
            component.addTag(component.optionLists[0].options[0]);
            component.addTag(component.optionLists[0].options[1]);
            component.addTag(component.optionLists[1].options[0]);
            expect(component.values).toEqual([]);
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            component.values = [component.optionLists[0].options[0]];
        });
        it('should remove from value array if matched', () => {
            component.removeTag(component.optionLists[0].options[0]);
            expect(component.values).toEqual([]);
        });
        it('should not remove from value array if no match', () => {
            component.removeTag(component.optionLists[1].options[0]);
            expect(component.values).toEqual([
                component.optionLists[0].options[0],
            ]);
        });
    });

    describe('removeLastTag', () => {
        beforeEach(() => {
            component.values = [
                component.optionLists[0].options[0],
                component.optionLists[0].options[1],
            ];
        });
        it('should remove last value', () => {
            component.removeLastTag();
            expect(component.values.length).toEqual(1);
            expect(component.values[0].id).toEqual(
                component.optionLists[0].options[0].id,
            );
            expect(component.highlightedOption).toBeNull();
        });
        it('should not crash when no value left', () => {
            component.removeLastTag();
            component.removeLastTag();
            component.removeLastTag();
            expect(component.values.length).toEqual(0);
            expect(component.highlightedOption).toBeNull();
        });
    });

    describe('filteredOptions', () => {
        beforeEach(() => {
            component.values = [];
        });
        it('should return all options if none selected with no search input', () => {
            expect(component.filteredOptions.length).toEqual(4);
        });
        it('should return remaining options if 1 selected with no search input', () => {
            component.addTag(component.optionLists[0].options[0]);
            expect(component.filteredOptions.length).toEqual(3);
        });
        it('should return matched options if none selected with search input', () => {
            component.inputText = '2';
            expect(component.filteredOptions.length).toEqual(2);
        });
        it('should return remaining matched option if 1 selected and 2 filtered by search input', () => {
            component.addTag(component.optionLists[0].options[0]);
            component.inputText = '1';
            expect(component.filteredOptions.length).toEqual(1);
        });
        it('should return no options and search has no match', () => {
            component.inputText = 'z';
            expect(component.filteredOptions).toEqual([]);
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
            component.handleSelection(
                new Event('click'),
                component.optionLists[0].options[0],
            );
            expect(component.values).toEqual([
                component.optionLists[0].options[0],
            ]);
        });
    });

    describe('highlightFirstOption()', () => {
        it('should highlight the first option', () => {
            component.highlightOption(0);
            expect(component.highlightedOption.id).toEqual('mdt-1');
        });
    });

    describe('highlightNextOption()', () => {
        beforeEach(() => {});
        it('should highlight the first option', () => {
            component.highlightNextOption();
            expect(component.highlightedOption.id).toEqual('mdt-1');
        });
        it('should highlight the second option', () => {
            component.highlightOption(0);
            component.highlightNextOption();
            expect(component.highlightedOption.id).toEqual('mdt-2');
        });
        it('should be able to select next group', () => {
            component.highlightOption(0);
            component.highlightNextOption();
            component.highlightNextOption();
            expect(component.highlightedOption.id).toEqual('hcp-1');
        });
        it('should roundtrip back to first option', () => {
            component.highlightOption(0);
            component.highlightNextOption();
            component.highlightNextOption();
            component.highlightNextOption();
            component.highlightNextOption();
            expect(component.highlightedOption.id).toEqual('mdt-1');
        });
    });

    describe('highlightPreviousOption()', () => {
        beforeEach(() => {
            component.highlightOption(0);
        });
        afterEach(() =>
            expect(component.highlightedOption.id).toEqual('mdt-1'),
        );
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
            component.highlightNextOption();
            component.highlightNextOption();
        });
        it('highlight first: next and next roundtrip', () => {
            component.highlightPreviousOption();
            component.highlightPreviousOption();
            component.highlightPreviousOption();
            component.highlightPreviousOption();
        });
    });

    describe('addOptionAndHighlight()', () => {
        it('should add tag and highlight the first option', () => {
            component.highlightOption(0);
            component.addHighlightedOption();
            expect(component.highlightedOption).toBeNull();
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
