import { Goal, GoalType } from '@lib/goals/goal.model';

export class TestGoals {
    static build({ subphaseId = '1' }: Partial<Goal> = {}): Goal {
        return new Goal(
            'activityId',
            [
                {
                    value: 22,
                    dateTime: new Date(),
                },
                {
                    value: 20,
                    dateTime: new Date(),
                },
            ],
            10,
            '1',
            '2',
            subphaseId,
            '1',
            '1',
            25,
            'goalId',
            GoalType.weight,
        );
    }
}
