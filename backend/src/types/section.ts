import { Lesson } from "./lesson";
import { Lecture } from "./lecture";

export type Section = {
    title: string;
    updated_at: Date;
    id: number;
    lecture: Lecture[];
};
