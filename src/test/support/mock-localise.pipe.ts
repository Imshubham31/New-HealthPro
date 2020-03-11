import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'localise',
    pure: false,
})
export class MockLocalisePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return value;
    }
}
