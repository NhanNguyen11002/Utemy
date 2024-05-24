import { QuizAnswerType } from "./quiz";

export type TestResponse = {
    description: string;
    title: string;
    duration: string;
    is_time_limit: boolean;
    test_id: number;
    number_of_question: number;
    pass_percent: number;
    test_detail: TestDetail[];
};
export type TestDetail = {
    quiz_id: number;
    question: string;
    type: number;
    quiz_answer: QuizAnswerType[];
};

export type TestResultType = {
    test_id: number;
    test_progress: TestProgressType[];
};
export type TestProgressType = {
    quiz_id: number;
    quiz_answer_id: number;
    quiz_answer_string?: string;
    type: number;
    is_correct: boolean;
};
export type AfterTest = {
    totalPercent: number;
    totalQuestionRight: number;
};
export type TestHistoryResponse = {
    test_history_id: number;
    test_id: number;
    total_score: number;
    total_percent: number;
    is_pass: boolean;
    created_at: string;
    total_question: number;
};
export type CreateTestType = {
    course_id: number;
    duration: number;
    description: string;
    title: string;
    quiz_group_id: number;
    pass_percent: number;
    is_time_limit: boolean;
};
