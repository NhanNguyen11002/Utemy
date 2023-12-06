import apiCaller from "../api-config/apiCaller";
import { RatingCourse, GetRating, EditRating } from "../types/rating";

const ratingCourse = async (values: RatingCourse) => {
    const path = "rating";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const getListRatingOfCourseBySlug = async (values: GetRating) => {
    const path = `course/${values.slug}/rating?page_index=${values.page_index}&score=${values.score}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getRatingPercentOfCourse = async (values: string) => {
    const path = `course/percent/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const editRating = async (values: EditRating) => {
    const path = "rating";
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const deleteRating = async (values: number) => {
    const path = `rating/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getUserRating = async (values: number) => {
    const path = `rating/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const ratingApis = {
    ratingCourse,
    getRatingPercentOfCourse,
    editRating,
    deleteRating,
    getUserRating,
    getListRatingOfCourseBySlug,
};

export default ratingApis;
