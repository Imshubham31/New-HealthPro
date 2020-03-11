import * as find from 'lodash/find';
import * as last from 'lodash/last';
import * as head from 'lodash/head';

import {
    EducationalContent,
    Pathway,
    Phase,
    SubPhase,
    ContentStatus,
} from './pathway.model';
import { oc } from 'ts-optchain';

export interface TaskProgress {
    completed: number;
    total: number;
}

export class PathwayUtils {
    static getCurrentPhaseTitle(pathway: Pathway) {
        if (!pathway) {
            return null;
        }

        return oc(PathwayUtils.getCurrentPhase(pathway)).title();
    }

    static getCurrentSubPhaseTitle(pathway: Pathway) {
        if (!pathway) {
            return null;
        }

        return oc(PathwayUtils.getCurrentSubPhase(pathway)).title();
    }

    static getCurrentPhase(pathway: Pathway): Phase {
        if (!pathway) {
            return null;
        }

        return find(pathway.phases, { id: pathway.currentPhaseId });
    }

    static getCurrentSubPhase(pathway: Pathway): SubPhase {
        if (!pathway) {
            return null;
        }

        const phase: Phase = PathwayUtils.getCurrentPhase(pathway);
        return find(phase.subphases, { id: pathway.currentSubphaseId });
    }

    static getNextPhase(pathway: Pathway): Phase {
        if (!pathway) {
            return null;
        }

        return pathway.phases.find(
            phase =>
                phase.order === PathwayUtils.getCurrentPhase(pathway).order + 1,
        );
    }

    static getNextSubPhase(pathway: Pathway): SubPhase {
        if (!pathway || PathwayUtils.isFinalSubPhase(pathway)) {
            return null;
        }
        const nextSubphaseOfPhase = PathwayUtils.getCurrentPhase(
            pathway,
        ).subphases.find(
            subphase =>
                subphase.order ===
                PathwayUtils.getCurrentSubPhase(pathway).order + 1,
        );
        const firstSubphaseOfNextPhase = PathwayUtils.isFinalPhase(pathway)
            ? undefined
            : head(PathwayUtils.getNextPhase(pathway).subphases);
        return nextSubphaseOfPhase || firstSubphaseOfNextPhase;
    }

    static getPhaseOfNextSubphase(pathway: Pathway) {
        return pathway.phases.find(phase =>
            phase.subphases.includes(PathwayUtils.getNextSubPhase(pathway)),
        );
    }

    static isFinalPhase(pathway: Pathway): boolean {
        const phase: Phase = PathwayUtils.getCurrentPhase(pathway);
        return phase === last(pathway.phases);
    }

    static isFinalSubPhase(pathway: Pathway): boolean {
        const phase: Phase = PathwayUtils.getCurrentPhase(pathway);
        const subphase: SubPhase = find(phase.subphases, {
            id: pathway.currentSubphaseId,
        });
        return (
            phase === last(pathway.phases) && subphase === last(phase.subphases)
        );
    }

    static getCurrentEducationalProgress(pathway: Pathway): TaskProgress {
        const subphase = this.getCurrentSubPhase(pathway);
        return this.getSubphaseEducationalProgress(subphase);
    }

    static getSubphaseEducationalProgress(subphase: SubPhase): TaskProgress {
        if (!subphase) {
            return {
                completed: 0,
                total: 0,
            };
        }

        const educationalItems = PathwayUtils.getEducationalItemsForSubphase(
            subphase,
        );
        return {
            completed: educationalItems.filter(
                item => item.status === 'COMPLETE',
            ).length,
            total: educationalItems.length,
        };
    }

    static getCurrentEducationalItems(pathway: Pathway): EducationalContent[] {
        const subPhase = PathwayUtils.getCurrentSubPhase(pathway);
        return this.getEducationalItemsForSubphase(subPhase);
    }

    static getEducationalItemsForSubphase(
        subphase: SubPhase,
    ): EducationalContent[] {
        if (!subphase) {
            return [];
        }
        return subphase
            ? subphase.items
                  .filter(item => item.type === 'educationalcontent')
                  .map(item => item.educationalcontent)
            : [];
    }

    static getEducationalItem(pathway: Pathway, id: string) {
        let content: EducationalContent;
        pathway.phases.forEach(phase =>
            phase.subphases.forEach(subphase =>
                subphase.items.forEach(item => {
                    if (
                        item.educationalcontent &&
                        item.educationalcontent.id === id
                    ) {
                        content = item.educationalcontent;
                    }
                }),
            ),
        );
        return content;
    }

    static completeEducationalItem(pathway: Pathway, id: string): Pathway {
        pathway.phases.forEach(phase =>
            phase.subphases.forEach(subphase =>
                subphase.items.forEach(item => {
                    if (
                        item.educationalcontent &&
                        item.educationalcontent.id === id
                    ) {
                        item.educationalcontent.status = ContentStatus.COMPLETE;
                    }
                }),
            ),
        );
        return pathway;
    }

    static getPreviousSubphases(pathway: Pathway) {
        const phases = pathway.phases;
        const phase: Phase = PathwayUtils.getCurrentPhase(pathway);
        const currentSubphase: SubPhase = PathwayUtils.getCurrentSubPhase(
            pathway,
        );
        const currentSubphaseIndex = phase.subphases.indexOf(currentSubphase);
        const previousSubphases =
            currentSubphaseIndex > -1
                ? phase.subphases.slice(0, currentSubphaseIndex)
                : [];
        const phaseIndex = phases.indexOf(phase);
        const previousPhases =
            phaseIndex > -1 ? phases.slice(0, phaseIndex) : [];
        previousPhases.forEach(previousPhase =>
            previousPhase.subphases.forEach(previousPhaseSubphase =>
                previousSubphases.push(previousPhaseSubphase),
            ),
        );
        return previousSubphases;
    }
}
