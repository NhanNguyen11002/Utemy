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
const getCourseCountByOwner = async () => {
    const path = `stat/course-owner`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop5EnrolledCourseByOwner = async () => {
    const path = `stat/course-top5-enrolled`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTop5RateCourseByOwner = async () => {
    const path = `stat/course-top5-rate`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getIncomeByOwner = async () => {
    const path = `stat/income`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getIncomeByCourseByOwner = async () => {
    const path = `stat/income-by-course`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getIncomeByMonthByOwner = async (values: number) => {
    const path = `stat/income-by-month/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalEnrolledByOwner = async () => {
    const path = `stat/total-enrolled-by-owner`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEnrolledByTimeByOwner = async (period: string, startDate: string, endDate: string) => {
    const path = `stat/enrolled-stat-by-time?period=${period}&startDate=${startDate}&endDate=${endDate}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEnrolledByMonthByOwner = async (values: number) => {
    const path = `stat/enrolled-stat-by-year/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalIncomeSaleCourse = async () => {
    const path = `stat/income-sale-course`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalIncomeOriginCourse = async () => {
    const path = `stat/income-origin-course`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalPassUnpass= async () => {
    const path = `stat/total-pass-unpass`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getAvgRateAllCourse= async () => {
    const path = `stat/avg-rate-all-course`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getRatingPercentByOwner= async () => {
    const path = `stat/rating-percent-by-owner`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getTotalTurnRating= async () => {
    const path = `stat/total-turn-rating`;
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

    getCourseCountByOwner,
    getTop5EnrolledCourseByOwner,
    getTop5RateCourseByOwner,
    getIncomeByOwner,
    getIncomeByCourseByOwner,
    getIncomeByMonthByOwner,
    getTotalEnrolledByOwner,
    getEnrolledByTimeByOwner,
    getEnrolledByMonthByOwner,
    getTotalIncomeSaleCourse,
    getTotalIncomeOriginCourse,
    getTotalPassUnpass,
    getAvgRateAllCourse,
    getRatingPercentByOwner,
    getTotalTurnRating,
};

export default statisticApis;
