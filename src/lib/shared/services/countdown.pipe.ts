import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countdown',
    pure: true,
})
export class CountdownPipe implements PipeTransform {
    transform(text: string, args: number) {
        const maxLength = args || 0;
        if (!text) {
            return maxLength;
        }
        return maxLength - text.length;
    }
}
