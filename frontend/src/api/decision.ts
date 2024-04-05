import apiCaller from "../api-config/apiCaller";

const createDecision = async (values: any) => {
    const path = `decision`;
    const reponse = await apiCaller("post", path, values);
    return reponse;
};
const getDecisionsByCourseId = async (values: number) => {
    const path = `decision/course/${values}`;
    const response = await apiCaller("get", path);
    return response;
};
const uploadEvidence = async (values: FormData) => {
    const path = `decision/evidence`;
    const response = await apiCaller("post", path, values);
    return response;
};
const decisionApis = {
    createDecision,
    getDecisionsByCourseId,
    uploadEvidence,
};

export default decisionApis;
