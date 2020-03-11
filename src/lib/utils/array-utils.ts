export class ArrayUtils {
    public static toMap<TKey, TValue>(
        arr: TValue[],
        mapKey: (x: TValue) => TKey,
    ): Map<TKey, TValue> {
        if (!arr) {
            return null;
        }
        const res = new Map<TKey, TValue>();
        arr.forEach((el: TValue) => {
            const key: TKey = mapKey(el);
            if (res.has(key)) {
                throw new Error('duplicate entry found for id: ' + key);
            }
            res.set(key, el);
        });
        return res;
    }

    public static toLookup<TKey, TValue>(
        arr: TValue[],
        mapKey: (x: TValue) => TKey,
    ): Map<TKey, TValue[]> {
        return this.toLookupFor(arr, mapKey, (x: TValue) => x);
    }

    public static toLookupFor<T, TKey, TValue>(
        arr: T[],
        mapKey: (x: T) => TKey,
        mapValue: (x: T) => TValue,
    ): Map<TKey, TValue[]> {
        if (!arr) {
            return null;
        }
        const res = new Map<TKey, TValue[]>();
        arr.forEach((el: T) => {
            const key: TKey = mapKey(el);
            let existing = res.get(key);
            if (!existing) {
                res.set(key, (existing = []));
            }
            existing.push(mapValue(el));
        });
        return res;
    }

    public static toArray<TKey, TValue>(map: Map<TKey, TValue>): TValue[] {
        if (!map) {
            return null;
        }
        const arr: TValue[] = [];
        map.forEach((val: TValue) => arr.push(val));
        return arr;
    }

    public static identity<T>(): (_val: T) => T {
        return x => x;
    }
}
