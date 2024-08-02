import apiCaller from "../api-config/apiCaller";
import { GetApproval } from "../types/approval";

const createApproval = async (values: number) => {
    const path = `approval`;
    const reponse = await apiCaller("post", path, { course_id: values });
    return reponse;
};
const getApprovalsWithPagenation = async (values: GetApproval) => {
    const path = `approval?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const response = await apiCaller("get", path);
    return response;
};
const approvalApis = {
    createApproval,
    getApprovalsWithPagenation,
};

export default approvalApis;
