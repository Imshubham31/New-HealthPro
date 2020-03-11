import { Response } from '@angular/http';
export class MockError extends Response implements Error {
    name: any;
    message: any;
}
