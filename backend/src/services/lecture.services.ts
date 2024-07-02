import { ResponseSuccess, ResponseError, ResponseBase, resolutions } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import constants from "../constants";
import { LectureResponse } from "~/types/lecture";
import LessonServices from "./lesson.services";
import TestServices from "./test.services";
import { CreateLessonType } from "../types/lesson";
import { CreateTestType } from "~/types/test";
const createLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const videoFile = req.file;
        const { type, section_id, duration, description, title, quiz_group_id, pass_percent, is_time_limit } = req.body;
        const createLecture = await configs.db.lecture.create({
            data: {
                type,
                section_id: Number(section_id),
            },
        });
        if (type === "Lesson") {
            if (!videoFile) return new ResponseError(500, constants.error.ERROR_BAD_REQUEST, false);
            const lessonContent: CreateLessonType = {
                duration,
                description,
                title,
                videoFile,
            };
            return LessonServices.createLesson(lessonContent, createLecture.id);
        } else {
            const testContent: CreateTestType = {
                title,
                quiz_group_id,
                pass_percent,
                is_time_limit,
                description,
                duration,
            };
            return TestServices.createTest(testContent, createLecture.id);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const videoFile = req.file;
        const { lecture_id, type, duration, description, title, quiz_group_id, pass_percent, is_time_limit } = req.body;
        const isLectureExist = await configs.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteProgress = await configs.db.progress.updateMany({
            where: {
                lecture_id: isLectureExist.id,
            },
            data: {
                is_delete: true,
            },
        });
        if (type === "Lesson") {
            const lessonContent = {
                duration,
                description,
                title,
                videoFile,
            };
            if (isLectureExist.type === "Lesson") {
                return LessonServices.updateLesson(lessonContent, isLectureExist.id);
            } else {
                TestServices.deleteTest(isLectureExist.id);
                const updateType = await configs.db.lecture.update({
                    where: {
                        id: isLectureExist.id,
                    },
                    data: {
                        type: "Lesson",
                    },
                });
                return LessonServices.createLesson(lessonContent, isLectureExist.id);
            }
        } else {
            const testContent: CreateTestType = {
                title,
                quiz_group_id,
                pass_percent,
                is_time_limit,
                description,
                duration,
            };
            if (isLectureExist.type === "Lesson") {
                LessonServices.deleteLesson(isLectureExist.id);
                const updateType = await configs.db.lecture.update({
                    where: {
                        id: isLectureExist.id,
                    },
                    data: {
                        type: "Test",
                    },
                });
                return TestServices.createTest(testContent, isLectureExist.id);
            } else {
                return TestServices.updateTest(testContent, isLectureExist.id);
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lecture_id } = req.params;
        const isLectureExist = await configs.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteLecture = await configs.db.lecture.update({
            where: {
                id: Number(lecture_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (deleteLecture) {
            const deleteProgress = await configs.db.progress.updateMany({
                where: {
                    lecture_id: Number(lecture_id),
                },
                data: {
                    is_delete: true,
                },
            });
            if (isLectureExist.type === "Lesson") {
                return LessonServices.deleteLesson(isLectureExist.id);
            } else {
                return TestServices.deleteTest(isLectureExist.id);
            }
        } else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getLectureById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lecture_id } = req.params;
        const isFoundLecture = await configs.db.lecture.findFirst({
            where: {
                id: parseInt(lecture_id),
                is_delete: false,
            },
            include: {
                lesson: {
                    select: {
                        duration: true,
                        url_video: true,
                        description: true,
                        title: true,
                    },
                },
                test: {
                    select: {
                        title: true,
                        duration: true,
                        description: true,
                        is_time_limit: true,
                        pass_percent: true,
                        quiz_group_id: true,
                    },
                },
            },
        });
        if (isFoundLecture) {
            let temp: LectureResponse = {
                lecture_id: isFoundLecture.id,
                type: isFoundLecture.type,
            };
            if (isFoundLecture.type === "Lesson") temp = { ...temp, content: isFoundLecture.lesson };
            else temp = { ...temp, content: isFoundLecture.test };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_LESSON, true, temp);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const LectureServices = {
    createLecture,
    updateLecture,
    deleteLecture,
    getLectureById,
};
export default LectureServices;
