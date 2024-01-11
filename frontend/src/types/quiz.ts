export type QuizType = {
    quiz_id: number;
    question: string;
    quiz_group_id: number;
    type: number;
    updated_at?: string;
    quiz_answer: QuizAnswerType[];
};
export type GetAllQuizInGroupResponse = {
    quiz_group_id: number;
    quiz: QuizType[];
};
export type QuizCreateType = {
    quiz_id: number;
    question: string;
    quiz_group_id: number;
    type: number;
    quiz_answer: QuizAnswerType[];
};
export type QuizAnswerType = {
    quiz_answer_id?: number;
    answer: string;
    is_correct: boolean;
};

export type QuizGroupType = {
    quiz_group_id: number;
    title: string;
    description: string;
};
export type QuizGroupCreateType = {
    title: string;
    description: string;
};

export type GetAllQuizInGroup = {
    searchItem: string;
    quiz_group_id: number;
};
