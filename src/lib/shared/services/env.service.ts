import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class EnvService {
    get() {
        return environment;
    }
}
