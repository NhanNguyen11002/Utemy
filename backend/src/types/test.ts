export type CreateTestType = {
    description: string;
    duration: string;
    is_time_limit: string;
    pass_percent: string;
    quiz_group_id: number;
    title: string;
};
export type TestProgressType = {
    quiz_answer_id: number;
    is_correct: boolean;
    quiz_id: number;
};
