import {
    Component,
    Input,
    HostListener,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';

import { Service } from '@lib/shared/components/modal/service';

export enum Keys {
    Backspace = 'Backspace',
    Enter = 'Enter',
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
}
@Component({
    selector: 'app-modal-multi-tag-input',
    templateUrl: './multi-tag-input.component.html',
    styleUrls: ['./multi-tag-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalMultiTagInputComponent {
    value = [];
    inputText = '';
    hasFocus = false;
    highlightedOptionId: number = null;
    backspaceCount = 1;
    disabled = false;
    preventBlur = false;

    @ViewChild('input', { static: false }) input: ElementRef;
    @ViewChild('mtagdropdown', { static: false }) dropdown: ElementRef;

    @Input() prefixTags = [];
    @Input() options = [];
    @Input() matchProperty: string;
    @Input() labelFormatter: (data: any) => string;
    @Input() detailLabelFormatter: (data: any) => string = null;
    @Input() placeholder = '';
    @Input() canRemoveLastTag = true;
    @Input() absolute = true;
    @Input() checkTagDisabled = (_data: any) => false;

    constructor(public service: Service, private eRef: ElementRef) {
        service.getValue().subscribe(val => {
            this.value = (val as Array<any>) || [];
        });
        service.disabled$.subscribe(disabled => {
            this.disabled = disabled;
        });
    }

    // Maybe a performance issue doing this
    get dropdownOptions(): any[] {
        return this.options
            .filter(option => {
                if (this.inputText === '') {
                    return true;
                }
                return this.labelFormatter(option)
                    .toLocaleLowerCase()
                    .includes(this.inputText.toLocaleLowerCase());
            })
            .filter(option => {
                return !Boolean(
                    this.value.find(
                        value =>
                            value[this.matchProperty] ===
                            option[this.matchProperty],
                    ),
                );
            });
    }

    addTag(tag: any) {
        this.value = [...this.value, tag];
        this.service.onChange(this.value);
        this.inputText = '';
        this.input.nativeElement.focus();
        this.resetHighlight();
    }

    removeTag(tagToRemove: any) {
        if (
            this.checkTagDisabled(tagToRemove) ||
            !this.canRemoveTag(tagToRemove)
        ) {
            return;
        }
        this.value = this.value.filter(tag => tag !== tagToRemove);
        this.service.onChange(this.value);
        this.resetHighlight();
    }

    removeLastTag() {
        this.removeTag(this.value[this.value.length - 1]);
    }

    handleFocus() {
        this.hasFocus = true;
        this.resetHighlight();
    }

    handleBlur() {
        if (this.preventBlur) {
            this.preventBlur = false;
            event.preventDefault();
            return false;
        }
        this.hasFocus = false;
        return true;
    }

    handleInput(event: any) {
        if (this.inputText !== event.target.value) {
            const selected =
                this.highlightedOptionId !== null
                    ? this.dropdownOptions[this.highlightedOptionId]
                    : null;
            this.inputText = event.target.value;
            if (!selected) {
                this.resetHighlight();
            } else {
                this.highlightOption(
                    this.dropdownOptions.findIndex(
                        opt => opt.id === selected.id,
                    ),
                );
            }
        }
        this.backspaceCount = 0;
    }

    handleSelection(event, option) {
        event.preventDefault();
        this.handleFocus();
        this.addTag(option);
    }

    resetHighlight(): void {
        this.highlightedOptionId = null;
    }

    canRemoveTag(_tag: any): boolean {
        return (
            !this.checkTagDisabled(_tag) &&
            (this.value.length > 1 || this.canRemoveLastTag)
        );
    }

    highlightOption(index: number): void {
        const count = this.dropdownOptions.length;
        if (!count || count === 0 || index > count) {
            this.resetHighlight();
            return;
        }
        if (index < 0) {
            this.highlightedOptionId = count - 1;
        } else if (index >= count) {
            this.highlightedOptionId = 0;
        } else {
            this.highlightedOptionId = index;
        }
        this.scrollToHighlighted();
    }

    highlightNextOption() {
        this.highlightOption(
            this.highlightedOptionId !== null
                ? this.highlightedOptionId + 1
                : 0,
        );
    }

    highlightPreviousOption() {
        this.highlightOption(
            (this.highlightedOptionId !== null ? this.highlightedOptionId : 0) -
                1,
        );
    }

    addHighlightedOption() {
        if (this.highlightedOptionId === null) {
            return;
        }
        this.addTag(this.dropdownOptions[this.highlightedOptionId]);
    }

    handleKeyup(event: KeyboardEvent) {
        switch (event.key) {
            case Keys.Backspace:
                if (this.inputText === '') {
                    this.backspaceCount++;
                }
                if (this.backspaceCount > 1 && this.inputText === '') {
                    this.removeLastTag();
                }
                break;
            case Keys.ArrowDown:
                this.highlightNextOption();
                break;
            case Keys.ArrowUp:
                this.highlightPreviousOption();
                break;
        }
    }

    handleKeydown(event: KeyboardEvent): void {
        this.preventBlur = false;
        switch (event.key) {
            case Keys.Enter:
                this.addHighlightedOption();
                event.preventDefault(); // prevent submitting
                break;
        }
    }

    trackByMatchProperty(_index: number, tag: any) {
        return tag[this.matchProperty];
    }

    scrollToHighlighted() {
        if (this.highlightedOptionId === null) {
            return;
        }
        const parent = this.dropdown.nativeElement;
        const child = document.getElementById(
            'mtag-option-' + this.highlightedOptionId,
        );
        if (!child) {
            return;
        }
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        const isFullyVisible =
            childRect.top >= parentRect.top &&
            childRect.top + child.clientHeight <=
                parentRect.top + parent.clientHeight;
        // if you can't see the child try to scroll parent
        if (!isFullyVisible) {
            // scroll by offset relative to parent
            parent.scrollTop =
                childRect.top + parent.scrollTop - parentRect.top;
        }
    }

    @HostListener('click')
    onClick() {
        if (this.disabled) {
            return;
        }
        this.handleFocus();
        this.input.nativeElement.focus();
    }

    @HostListener('document:mousedown', ['$event'])
    clickedOutside(event: any) {
        if (event.path) {
            this.preventBlur = event.path.includes(this.eRef.nativeElement);
        }
    }
}
