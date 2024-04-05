export type Approval = {
    approval_id: number;
    course_id: number;
    created_at: Date;
    is_handle: boolean;
};
export type ApprovalCard = {
    approval_id: number;
    course_id: number;
    course_title: string;
    course_thumbnail: string;
    course_slug: string;
    created_at: Date;
};
export type GetApproval = {
    pageIndex: number;
    keyword: string;
};
