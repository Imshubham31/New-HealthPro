import { Goal } from '@lib/goals/goal.model';

export interface GoalProgressState {
    handleGoal(goal: Goal);
}
