import { Lesson } from "./lesson";
import { Lecture } from "./lecture";
export type SectionRender = {
    title: string;
    updated_at: string;
    lessons: Lesson[];
};
export type Section = {
    id: number;
    title: string;
    lecture?: Lecture[];
};
export type AddSection = {
    course_id: number;
    title: string;
};
export type EditSection = {
    title: string;
    section_id: number;
};
