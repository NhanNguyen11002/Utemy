export type CreateReport = {
    course_id: number;
    is_lecture: boolean;
    lecture_id: number;
    title: string;
    content: string;
};

export type ReportType = {
    report_id: number;
    is_lecture: boolean;
    title: string;
    content: string;
    lecture: any;
    course: any;
    created_at: Date;
    is_handle: boolean;
};
export type GetReportByCourseIdType = {
    course_id: number;
    page_index: number;
};
