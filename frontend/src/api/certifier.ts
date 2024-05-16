import apiCaller from "../api-config/apiCaller";

const sendCertifier = async (values: number) => {
    const path = `certifier`;
    const reponse = await apiCaller("post", path, { course_id: values });
    return reponse;
};
const certifierApis = {
    sendCertifier,
};

export default certifierApis;
