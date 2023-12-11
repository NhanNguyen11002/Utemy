import apiCaller from "../api-config/apiCaller";
import { TestResultType } from "../types/test";
const getTestByTestId = async (values: number) => {
    const path = `test/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTestHistory = async (values: number) => {
    const path = `test/history/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createTestHistory = async (values: TestResultType) => {
    const path = `test/history`;
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const testApis = {
    getTestByTestId,
    createTestHistory,
    getTestHistory,
};

export default testApis;
