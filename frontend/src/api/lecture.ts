import apiCaller from "../api-config/apiCaller";
const getLectureById = async (values: number) => {
    const path = `lecture/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const updateLecture = async (values: FormData) => {
    const path = `lecture`;
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};

const createLecture = async (values: FormData) => {
    const path = `lecture`;
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const deleteLecture = async (values: number) => {
    const path = `lecture/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};

const lectureApis = {
    getLectureById,
    createLecture,
    updateLecture,
    deleteLecture,
};

export default lectureApis;
