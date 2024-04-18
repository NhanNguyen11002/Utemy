import { Lesson } from "./lesson";

export type Lecture = {
    lecture_id: number;
    type: string;
    content: any;
};
export type LectureTrial= {
    lecture_id: number;
    type: string;
    content: Lesson;
};
