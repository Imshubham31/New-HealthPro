import { FullTextSearchPipe } from './search.pipe';

describe('FullTextSearch pipe', () => {
    const searchPipe = new FullTextSearchPipe();
    const testArray = [
        {
            label: 'a',
        },
        {
            label: 'b',
        },
        {
            label: 'c',
        },
        {
            label: 'c',
        },
    ];

    it('should search and return 1', () => {
        const filtered = searchPipe.transform(testArray, 'b', 'label');
        expect(filtered[0].label).toBe(testArray[1].label);
        expect(filtered.length).toBe(1);
    });

    it('should search and return 2', () => {
        const filtered = searchPipe.transform(testArray, 'c', 'label');
        expect(filtered.length).toBe(2);
        expect(filtered[0].label).toBe(testArray[2].label);
        expect(filtered[1].label).toBe(testArray[3].label);
    });

    it('should search and return 0', () => {
        const filtered = searchPipe.transform(testArray, 'x', 'label');
        expect(filtered.length).toBe(0);
    });
});
