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
export type RatingPercent = {
    title: number;
    percent: number;
};
