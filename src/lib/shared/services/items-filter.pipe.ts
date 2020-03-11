import { Pipe, PipeTransform } from '@angular/core';

export interface Filteritems {
    value: string;
    checked: false;
    name: string;
}

@Pipe({
    name: 'checkboxFilter',
})
export class FilterPipe implements PipeTransform {
    transform(
        items: any,
        nestedKey: any,
        filterKeys: any,
        filterItems: Filteritems[],
        isAnd: boolean,
    ): any {
        if (filterKeys && Array.isArray(items) && filterItems) {
            const checkedItems = filterItems.filter(item => {
                return item.checked;
            });
            if (!checkedItems || checkedItems.length === 0) {
                return items;
            }
            if (isAnd) {
                return items.filter(item =>
                    filterKeys.reduce(
                        (acc1, keyName) =>
                            acc1 &&
                            checkedItems.reduce(
                                (acc2, checkedItem) =>
                                    (acc2 &&
                                        new RegExp(item[keyName]).test(
                                            checkedItem.value,
                                        )) ||
                                    checkedItem.value === '',
                                true,
                            ),
                        true,
                    ),
                );
            } else {
                if (nestedKey) {
                    return items.filter(item => {
                        return item[nestedKey].some(childItem => {
                            return filterKeys.some(keyName => {
                                return checkedItems.some(checkedItem => {
                                    return (
                                        new RegExp(
                                            childItem[keyName],
                                            'gi',
                                        ).test(checkedItem.value) ||
                                        checkedItem.value === ''
                                    );
                                });
                            });
                        });
                    });
                } else {
                    return items.filter(item => {
                        return filterKeys.some(keyName => {
                            return checkedItems.some(checkedItem => {
                                return (
                                    new RegExp(item[keyName], 'gi').test(
                                        checkedItem.value,
                                    ) || checkedItem.value === ''
                                );
                            });
                        });
                    });
                }
            }
        } else {
            return items;
        }
    }
}
