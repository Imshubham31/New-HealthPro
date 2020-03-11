import { Pipe, PipeTransform } from '@angular/core';
import * as orderBy from 'lodash/orderBy';
import * as get from 'lodash/get';

export interface SortParams {
    fields: string[];
    order?: string;
}

@Pipe({
    name: 'sortOn',
})
export class SortOnPipe implements PipeTransform {
    transform(value: any[], args: SortParams): any {
        if (
            !value ||
            value.length === 0 ||
            !args ||
            !args.fields ||
            args.fields.length === 0
        ) {
            return value;
        }

        return orderBy(
            value,
            item => {
                return get(item, args.fields[0])
                    .trim()
                    .toLowerCase();
            },
            [args.order ? args.order.toLowerCase() : 'asc'],
        );
    }
}
