import { SortOnPipe } from './sort-on.pipe';

const objects = [
    {
        field: 'c',
    },
    {
        field: 'ab',
    },
    {
        field: 'Ab',
    },
    {
        field: 'b',
    },
];

describe('App', () => {
    const sortPipe = new SortOnPipe();
    it('should sort objects asc', () => {
        const sorted = sortPipe.transform(objects, { fields: ['field'] });
        expect(sorted[0].field).toBe('ab');
        expect(sorted[1].field).toBe('Ab');
        expect(sorted[2].field).toBe('b');
        expect(sorted[3].field).toBe('c');
    });

    it('should sort objects desc', () => {
        const sorted = sortPipe.transform(objects, {
            fields: ['field'],
            order: 'desc',
        });
        expect(sorted[0].field).toBe('c');
        expect(sorted[1].field).toBe('b');
        expect(sorted[2].field).toBe('ab');
        expect(sorted[3].field).toBe('Ab');
    });

    it('should return undefined', () => {
        expect(sortPipe.transform(undefined, { fields: undefined })).toBe(
            undefined,
        );
    });
});
