export class Pathway {
    id: string;
    phases: Phase[];
    currentPhaseId: string;
    currentSubphaseId: string;
    title: string;
}

export interface Phase {
    id: string;
    templateId?: string; // TODO: Do we need this???
    templateRevision: string;
    order: number;
    subphases: SubPhase[];
    title: string;
    description: string;
    status?: string;
    iconUrl?: string;
}

export interface SubPhase {
    id: string;
    templateId: string;
    templateRevision: string;
    order: number;
    title: string;
    description: string;
    items: Item[];
    startDate: string;
    target?: number;
    goalId?: string;
    phaseId?: string;
    subphaseId?: string;
    status?: string;
}

interface Item {
    type: string;
    educationalcontent?: EducationalContent;
}

export interface EducationalContent {
    id: string;
    title: string;
    description: string;
    contentId: string;
    revision: string;
    type: string;
    status: ContentStatus;
    extension: string;
}

export enum ContentStatus {
    COMPLETE = 'COMPLETE',
    INCOMPLETE = 'INCOMPLETE',
}
