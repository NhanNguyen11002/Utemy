import apiCaller from "../api-config/apiCaller";

const updateProgress = async (values: any) => {
    const path = `progress`;
    const reponse = await apiCaller("post", path, values);
    return reponse;
};
const getProgressByCourseSlug = async (values: string) => {
    const path = `course/${values}/progress`;
    const reponse = await apiCaller("get", path);
    return reponse;
};

const progressApis = {
    updateProgress,
    getProgressByCourseSlug,
};

export default progressApis;
