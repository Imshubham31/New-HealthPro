import {
    Component,
    Input,
    HostListener,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
    OnInit,
} from '@angular/core';

import { Service } from '@lib/shared/components/modal/service';
import { ArrayUtils } from '@lib/utils/array-utils';
import { Unsubscribe } from '@lib/utils/unsubscribe';
import { Subscription } from 'rxjs';

export enum Keys {
    Backspace = 'Backspace',
    Enter = 'Enter',
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    Escape = 'Escape',
}

export interface TagModelList {
    name: string;
    options: TagModel[];
    noResultsMsg?: (_values: TagModel[]) => string;
}

export interface TagModel {
    id: string;
    name: string;
    detail: string;
    type: string;
}

@Component({
    selector: 'app-modal-multi-list-tag-input',
    templateUrl: './multi-list-tag-input.component.html',
    styleUrls: ['./multi-list-tag-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribe()
export class ModalMultiListTagInputComponent implements OnInit {
    subscriptions: Subscription[] = [];
    values: TagModel[] = [];
    valueMap = new Map<String, TagModel>();
    inputText = '';
    hasFocus = false;
    highlightedOption: TagModel = null;
    backspaceCount = 1;
    disabled = false;
    preventBlur = false;

    @ViewChild('input', { static: false }) input: ElementRef;
    @ViewChild('mltagdropdown', { static: false }) dropdown: ElementRef;

    @Input() prefixTags: string[] = [];
    @Input() optionLists: TagModelList[] = [];
    @Input() placeholder = '';
    @Input() allowUnknownValues = false;
    @Input() absolute = false;
    @Input() transformValue: (_val: any) => TagModel[] = ArrayUtils.identity<
        TagModel[]
    >();
    @Output() valueChanged = new EventEmitter<TagModel[]>();
    @Input() additionalTagFilter: (_val: TagModel) => boolean = _val => true;

    constructor(private service: Service, private eRef: ElementRef) {}

    ngOnInit(): void {
        this.subscriptions = [
            this.service.getValue().subscribe(val => {
                this.handleValueChanged(this.transformValue(val));
            }),
            this.service.disabled$.subscribe(disabled => {
                this.disabled = disabled;
            }),
        ];
    }

    handleValueChanged(changedValues: TagModel[]) {
        changedValues = changedValues || []; // never null or undefined
        if (!this.isChanged(changedValues)) {
            return;
        }
        this.valueMap = ArrayUtils.toMap(changedValues, v => v.id); // also checks on duplicates
        if (this.allowUnknownValues) {
            // don't care if values are present in the option list or not
            this.values = changedValues;
        } else {
            // use the option values instead of possibly tampered values that came in via service
            this.values = this.allOptions.filter(opt =>
                this.valueMap.has(opt.id),
            );
            if (this.values.length !== this.valueMap.size) {
                // prevent that developer misunderstand the behavior of this component
                throw new Error(
                    'Selected a value that is not in the option list!',
                );
            }
        }
        this.service.onChange(this.values);
        this.valueChanged.emit(this.values);
    }

    private isChanged(changedValues: TagModel[]): boolean {
        if (this.values === changedValues) {
            return false; // equal reference => ignore
        }
        if (this.values.length !== changedValues.length) {
            return true; // different length => always changed
        }
        return changedValues.some(v => !this.valueMap.has(v.id));
    }

    private get allOptions(): TagModel[] {
        return this.optionLists.reduce(
            (prev: TagModel[], list: TagModelList) => prev.concat(list.options),
            [],
        );
    }

    get filteredOptions(): TagModel[] {
        return this.filterTags(this.allOptions);
    }

    get filterOptionsGroups(): TagModelList[] {
        return this.optionLists.map((list: TagModelList) => {
            return {
                ...list,
                options: this.filterTags(list.options),
            };
        });
    }

    private filterTags(tags: TagModel[]): TagModel[] {
        return tags.filter(tag => this.isTagSelectable(tag));
    }

    private isTagSelectable(tag: TagModel): boolean {
        if (this.valueMap.has(tag.id)) {
            return false; // can only select unique values
        }
        if (
            this.inputText !== '' &&
            !tag.name.toLocaleLowerCase().includes(this.inputText)
        ) {
            return false; // filter by text
        }
        if (!this.additionalTagFilter(tag)) {
            return false; // filter by custom given code
        }
        return true;
    }

    addTag(tag: TagModel): void {
        if (!this.isTagSelectable(tag)) {
            return;
        }
        this.handleValueChanged([...this.values, tag]);
        this.inputText = '';
        this.input.nativeElement.focus();
        this.resetHighlight();
    }

    removeTag(tagToRemove: TagModel): void {
        this.handleValueChanged(this.values.filter(tag => tag !== tagToRemove));
        this.resetHighlight();
    }

    removeLastTag(): void {
        if (this.values.length === 0) {
            return;
        }
        this.removeTag(this.values[this.values.length - 1]);
    }

    handleFocus(): void {
        this.hasFocus = true;
        this.resetHighlight();
    }

    handleBlur(): boolean {
        if (this.preventBlur) {
            this.preventBlur = false;
            event.preventDefault();
            return false;
        }
        this.hasFocus = false;
        return true;
    }

    handleInput(event: any): void {
        if (this.inputText !== event.target.value) {
            this.inputText = event.target.value.toLocaleLowerCase();
            if (
                this.highlightedOption !== null &&
                !this.isTagSelectable(this.highlightedOption)
            ) {
                this.resetHighlight();
            }
        }
        this.backspaceCount = 0;
    }

    handleSelection(event: any, option: TagModel) {
        event.preventDefault();
        this.handleFocus();
        this.addTag(option);
    }

    resetHighlight(): void {
        this.highlightedOption = null;
    }

    highlightOption(index: number): void {
        const opts = this.filteredOptions;
        const count = opts.length;
        if (!count || count === 0 || index > count) {
            this.resetHighlight();
            return;
        }
        if (index < 0) {
            this.highlightedOption = opts[count - 1];
        } else if (index >= count) {
            this.highlightedOption = opts[0];
        } else {
            this.highlightedOption = opts[index];
        }
        this.scrollToHighlighted();
    }

    highlightNextOption() {
        this.highlightOption(
            this.highlightedOption !== null
                ? this.filteredOptions.indexOf(this.highlightedOption) + 1
                : 0,
        );
    }

    highlightPreviousOption() {
        this.highlightOption(
            this.highlightedOption !== null
                ? this.filteredOptions.indexOf(this.highlightedOption) - 1
                : 0,
        );
    }

    addHighlightedOption() {
        if (this.highlightedOption === null) {
            return;
        }
        this.addTag(this.highlightedOption);
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
            case Keys.Escape:
                this.resetHighlight();
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

    trackById(_index: number, model: TagModel) {
        return model.id;
    }
    trackByName(_index: number, model: TagModelList) {
        return model.name;
    }

    scrollToHighlighted() {
        if (this.highlightedOption === null) {
            return;
        }
        const parent = this.dropdown.nativeElement;
        const child = document.getElementById(
            'mltag-option-' + this.highlightedOption.id,
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
