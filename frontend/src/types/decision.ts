export type CreateDecision = {
    course_id: number;
    content: string;
    type: string;
};
export type DecisionType = {
    decision_id: number;
    course_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    type: string;
    is_handle: boolean;
    user_id: number;
};
