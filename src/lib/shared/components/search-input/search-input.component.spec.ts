import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchInputComponent } from '@lib/shared/components/search-input/search-input.component';
import { FormsModule } from '@angular/forms';
import * as cloneDeep from 'lodash/cloneDeep';
import { SimpleChange } from '../../../../../node_modules/@angular/core';
const mockData = {
    en: {
        searchString: 'John',
        data: [
            {
                fullName: 'John Doe',
            },
            {
                fullName: 'Timmy Toolbox',
            },
        ],
    },
    ar: {
        searchString: 'الفلاني',
        data: [
            {
                fullName: 'فلان الفلاني',
            },
            {
                fullName: 'أداة تيمي',
            },
        ],
    },
};

describe('SearchInputComponent', () => {
    let comp: SearchInputComponent;
    let fixture: ComponentFixture<SearchInputComponent>;
    const debounceTime = 1;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [SearchInputComponent],
        });
    });

    Object.keys(mockData).forEach(language => {
        describe(`searching language '${language}':`, () => {
            beforeEach(() => {
                fixture = TestBed.createComponent(SearchInputComponent);
                comp = fixture.componentInstance;
                comp.dataSource = mockData[language].data;
                comp.keys = ['fullName'];
                comp.debounceTime = debounceTime;
                comp.ngOnInit();
            });

            it('should initialize with search results equal to datasource', () => {
                expect(comp.results).toBe(mockData[language].data);
            });

            it('should search and return results', done => {
                comp.onChange.subscribe(results => {
                    expect(results.length).toBe(1);
                    done();
                });
                comp.inputChange(mockData[language].searchString);
            });

            it('should retain search results after datasource change', done => {
                comp.onChange.subscribe(results => {
                    expect(results.length).toBe(1);
                    done();
                });
                comp.searchValue = mockData[language].searchString;
                const newDataSource = cloneDeep(mockData[language].data);
                comp.ngOnChanges({
                    dataSource: new SimpleChange(
                        comp.dataSource,
                        newDataSource,
                        false,
                    ),
                });
            });

            it('should search and return no results', done => {
                comp.onChange.subscribe(results => {
                    expect(comp.results.length).toBe(0);
                    done();
                });
                comp.inputChange('123456');
            });

            it('should return the datasource for an empty string', done => {
                comp.onChange.subscribe(results => {
                    expect(comp.results).toBe(mockData[language].data);
                    done();
                });
                comp.inputChange('');
            });
        });
    });
});
