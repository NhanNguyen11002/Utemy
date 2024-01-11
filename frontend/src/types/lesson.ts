export type Lesson = {
    order?: number;
    id: number;
    title: string;
    url_video: string;
    duration: string;
    description: string;
};
export type AddLesson = {
    section_id: string;
    title: string;
    video: File | null;
    duration: string;
    description: string;
};
export type UpdateLesson = {
    id: number;
    title: string;
    video: File | null;
    duration: string;
    description: string;
};
