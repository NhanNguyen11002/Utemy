import apiCaller from "../api-config/apiCaller";
import { AddPromotion, SearchMyCourseEnrolledCourse, SearchAllCourses, UpdateTargetCourse } from "../types/course";

const createCourse = async (values: FormData) => {
    const path = "course";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const editCourse = async (values: FormData) => {
    const path = "course";
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const updateTargetCourse = async (values: UpdateTargetCourse) => {
    const path = `course/target`;
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const addPromotion = async (values: AddPromotion) => {
    const path = "course/promotion";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const stopPromotion = async (values: number) => {
    const path = `course/promotion/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getMyCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/my?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEnrolledCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/enrolled?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const deleteCourse = async (values: number) => {
    const path = `course/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getCourseDetail = async (values: string) => {
    const path = `course/${values}`;
    const reponse = await apiCaller("GET", path, values);
    return reponse;
};
const getCourseDetailById = async (values: number) => {
    const path = `course/detail/${values}`;
    const reponse = await apiCaller("GET", path, values);
    return reponse;
};
const getAllCourses = async (values: SearchAllCourses) => {
    let categoryParams = "";
    values.category?.forEach((temp) => {
        categoryParams += `&category=${temp}`;
    });
    const path = `course/all?page_index=${values.pageIndex}&sort_by=${values.sortBy}&search_item=${values.keyword}&evaluate=${values.rating}${categoryParams}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getRightOfCourse = async (values: number) => {
    const path = `course/right/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop10Rate = async () => {
    const path = `course/top10`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop10Enrolled = async () => {
    const path = `course/top-enrolled`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop10Sales = async () => {
    const path = `course/top10-sales`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const approveCourse = async (values: number) => {
    const path = `course/approve/${values}`;
    const reponse = await apiCaller("PATCH", path);
    return reponse;
};
const restrictCourse = async (values: number) => {
    const path = `course/restrict/${values}`;
    const reponse = await apiCaller("PATCH", path);
    return reponse;
};
const courseApis = {
    createCourse,
    getMyCourses,
    getEnrolledCourses,
    deleteCourse,
    getCourseDetail,
    getRightOfCourse,
    getTop10Rate,
    getTop10Enrolled,
    getTop10Sales,
    getCourseDetailById,
    editCourse,
    addPromotion,
    stopPromotion,
    getAllCourses,
    updateTargetCourse,
    approveCourse,
    restrictCourse,
};

export default courseApis;
