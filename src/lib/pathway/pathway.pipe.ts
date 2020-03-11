import { PathwayUtils } from './pathway-utils';
import { Pathway } from './pathway.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currentPhase',
    pure: false,
})
export class CurrentPhasePipe implements PipeTransform {
    transform(pathway: Pathway) {
        return PathwayUtils.getCurrentPhaseTitle(pathway);
    }
}

@Pipe({
    name: 'currentSubPhase',
    pure: false,
})
export class CurrentSubPhasePipe implements PipeTransform {
    transform(pathway: Pathway) {
        return PathwayUtils.getCurrentSubPhaseTitle(pathway);
    }
}
