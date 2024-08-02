import apiCaller from "../api-config/apiCaller";
import { GetReportByCourseIdType, CreateReport } from "../types/report";

const createReport = async (values: CreateReport) => {
    const path = `report`;
    const reponse = await apiCaller("post", path, values);
    return reponse;
};
const getReportByCourseId = async (values: GetReportByCourseIdType) => {
    const path = `report/course/${values.course_id}?page_index=${values.page_index}`;
    const response = await apiCaller("get", path);
    return response;
};
const getAllReportWithPagination = async (values: any) => {
    const path = `report?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const response = await apiCaller("get", path);
    return response;
};
const handleReport = async (values: number) => {
    const path = `report/handle/${values}`;
    const response = await apiCaller("patch", path);
    return response;
};
const reportApis = {
    createReport,
    getReportByCourseId,
    handleReport,
    getAllReportWithPagination,
};

export default reportApis;
