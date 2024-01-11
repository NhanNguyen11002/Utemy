export type FeedbackResponse = {
    feedback_id: number;
    content: string;
    first_name: string;
    last_name: string;
    url_avatar: string | null;
    user_id: number;
    created_at: Date | string;
    score: number;
};
