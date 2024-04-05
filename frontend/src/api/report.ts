import apiCaller from "../api-config/apiCaller";

const createApproval = async (values: any) => {
    const path = `approval`;
    const reponse = await apiCaller("post", path, values);
    return reponse;
};
const getApprovalsWithPagenation = async (values: number) => {
    const path = `approval?page_index=${values}`;
    const response = await apiCaller("get", path);
    return response;
};
const reportApis = {
    createApproval,
    getApprovalsWithPagenation,
};

export default reportApis;
