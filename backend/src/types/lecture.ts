import { Content } from "./type";
export type Lecture = {
    lecture_id: number;
    type: string;
    content: Content;
};

export type LectureResponse = {
    lecture_id: number;
    type: string;
    content?: Lesson | any;
};
type Lesson = {
    title: string;
    duration: string;
    description: string;
    url_video: string;
};
