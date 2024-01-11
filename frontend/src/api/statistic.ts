import { apiCaller } from "../api-config/apiCaller";
const getCategoryCourse = async () => {
    const path = "stat/category-course";
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const getCategoryEnrolled = async () => {
    const path = "stat/category-enrolled";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCategoryMoney = async () => {
    const path = "stat/category-money";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalUser = async () => {
    const path = "stat/total-user";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalMoney = async () => {
    const path = "stat/money";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalCourse = async () => {
    const path = "stat/course";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalInvoice = async () => {
    const path = "stat/total-invoice";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getRatingPercent = async () => {
    const path = "stat/rating-percent";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getMoneyByMonth = async (values: number) => {
    const path = `stat/money-by-month/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const statisticApis = {
    getCategoryCourse,
    getCategoryEnrolled,
    getCategoryMoney,
    getTotalUser,
    getTotalMoney,
    getTotalCourse,
    getRatingPercent,
    getMoneyByMonth,
    getTotalInvoice,
};

export default statisticApis;
