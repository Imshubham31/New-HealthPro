import { SubPhase, ContentStatus } from '@lib/pathway/pathway.model';

export class TestSubPhases {
    static create({
        id = '42',
        startDate = new Date().toISOString(),
        title = 'Sub Phase',
    } = {}): SubPhase {
        return {
            id,
            templateId: 'templateId',
            templateRevision: 'templateRevision',
            order: 2,
            title,
            description: 'Description',
            startDate,
            items: [
                {
                    type: 'educationalcontent',
                    educationalcontent: {
                        id: '1',
                        title: 'sub-phase title',
                        description: 'sub-phase description',
                        contentId: 'contentId',
                        revision: 'revision',
                        type: 'type',
                        status: ContentStatus.COMPLETE,
                        extension: 'pdf',
                    },
                },
                {
                    type: 'educationalcontent',
                    educationalcontent: {
                        id: '2',
                        title: 'sub-phase title',
                        description: 'sub-phase description',
                        contentId: 'contentId',
                        revision: 'revision',
                        type: 'document',
                        status: ContentStatus.INCOMPLETE,
                        extension: 'pdf',
                    },
                },
            ],
        };
    }
}
