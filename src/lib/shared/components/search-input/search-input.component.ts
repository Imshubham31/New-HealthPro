import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import * as Fuse from 'fuse.js';
import * as debounce from 'lodash/debounce';

@Component({
    selector: 'app-search-input',
    template: `
        <input
            class="form-input"
            type="search"
            [placeholder]="placeholder"
            [(ngModel)]="searchValue"
            (ngModelChange)="inputChange($event)"
        />
    `,
})
export class SearchInputComponent implements OnInit, OnChanges {
    @Input() dataSource: any[] = [];
    @Input() placeholder = 'Search...';
    @Input() keys: string[] = [];
    @Input() searchValue = '';
    @Input() debounceTime = 500;
    @Output() onChange = new EventEmitter<any[]>();
    results: any[] = [];
    private debounced;

    ngOnInit(): void {
        this.debounced = debounce(this.search, this.debounceTime);
        this.results = this.dataSource;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataSource) {
            this.results = changes.dataSource.currentValue;
            this.search(this.searchValue);
        }
    }

    inputChange(event: string) {
        this.debounced(event);
    }

    search(value) {
        const searchString = value.trim();
        if (!Boolean(searchString)) {
            this.results = this.dataSource;
            this.onChange.emit(this.results);
            return;
        }
        this.results = new Fuse(this.dataSource, {
            findAllMatches: true,
            threshold: 0,
            location: 0,
            distance: 100,
            matchAllTokens: true,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            tokenize: true,
            keys: this.keys,
        }).search(searchString);
        this.onChange.emit(this.results);
    }
}
