import { Pipe, PipeTransform } from '@angular/core';
import { LocaliseService } from '@lib/localise/localise.service';

export interface RestError {
    code: number;
    message: string;
    system: string;
}

const ERROR_MAPPINGS = {
    1002: 'emailExists',
    2023: 'duplicateMrn',
    1018: 'incorrectOldPassword',
    1009: 'pwdValidationNotComplex',
    1016: 'accountBlockedFifteenMinutes',
    3404: 'nameAndMrnNotFound',
    2022: 'duplicateNameAndMrn',
    1025: 'restrictProcessingAlreadyRequested',
    1023: 'requestDeletionInProgress',
};

@Pipe({
    name: 'errorMsg',
})
export class ErrorPipe implements PipeTransform {
    constructor(private localise: LocaliseService) {}

    transform(error: RestError, fallback?: string, params?: string[]): any {
        if (!error || !error.code || !ERROR_MAPPINGS[error.code]) {
            return fallback
                ? this.localise.fromParamsOrKey(fallback, params)
                : this.localise.fromKey('unknownError');
        }

        return this.localise.fromParamsOrKey(
            ERROR_MAPPINGS[error.code],
            params,
        );
    }
}
