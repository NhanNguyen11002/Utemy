export type CategoryCourse = {
    id: number;
    title: string;
    course_count: number;
};
export type CategoryEnrolled = {
    category_id: number;
    title: string;
    total_enrolled: number;
};
export type CategoryMoney = {
    category_id: number;
    category_title: string;
    total_money_from_category: number;
};
export type MoneyByMonth = {
    total_money_month: number;
    month_label: number;
};
export type EnrollByMonth = {
    total_enroll_month: number;
    month_label: number;
};
export type RatingPercent = {
    title: number;
    percent: number;
};
export type CourseCountStat = {
    course_count: number;
    course_approve_count: number;
    course_not_approve_count: number;
};
export type IncomeByCourse = {
    course_id: number;
    course_title: string;
    course_slug: string;
    number_of_enrolled: number;
    total_revenue: number;
};
export type EnrollStat = {
    total_enrolled: number;
    total_pass: number;
    total_unpass: number;
};
export type RankCourse = {
    course_id: number;
    title: string;
    slug: string;
    thumbnail: string;
    average_rating: number;
    number_of_enrolled: number;
    total_income_this_course: number;
    total_report_this_course: number;
};
export type RankLecturer = {
    lecturer_id: number;
    url_avt: string;
    first_name: string;
    last_name: string;
    average_rating: number;
    number_of_enrolled: number;
    total_income_this_lecturer: number;
    total_report_this_lecturer: number;
};
