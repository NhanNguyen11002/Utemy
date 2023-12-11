export type Lesson = {
    id: number;
    title: string;
    url_video: string;
};
export type orderLesson = {
    lesson_id: number;
    new_order: number;
};

export type CreateLessonType = {
    videoFile?: Express.Multer.File;
    title: string;
    duration: string;
    description: string;
};
