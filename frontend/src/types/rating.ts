export type Rating = {
    id: number | undefined;
    score: number | undefined;
    content: string;
    created_at: string;
    url_avatar: string | null;
    first_name: string;
    last_name: string;
    user_id: number;
};
export type ListRating = {
    total_page: number;
    total_record: number;
    data: Rating[];
};
export type RatingCourse = {
    score: number;
    content: string;
    course_id: number;
};
export type EditRating = {
    score: number;
    content: string;
    rating_id: number;
};
export type GetRating = {
    slug: string;
    page_index: number;
    score: number;
};
export type RatingPercent = {
    percent: number;
    score: number;
};
