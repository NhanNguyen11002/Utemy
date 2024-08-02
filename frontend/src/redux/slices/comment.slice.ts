import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import { Comment, CreateUpdateComment, GetCommentsWithPagination, GetCommentsWithPaginationByLectureId } from "@/types/comment";

export const createComment = createAsyncThunk<Response<null>, { lecture_id: number, content: string }, { rejectValue: Response<null> }>(
    "comment/create",
    async ({ lecture_id, content }, ThunkAPI) => {
        try {
            const response = await apis.commentApis.createComment(lecture_id, content);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

export const updateComment = createAsyncThunk<Response<null>, { comment_id: number, content: string }, { rejectValue: Response<null> }>(
    "comment/update",
    async ({ comment_id, content }, thunkAPI) => {
        // Change the parameter to underscore (_) to indicate it's unused
        try {
            const response = await apis.commentApis.updateComment(comment_id, content);
            return response.data as Response<null>;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.data);
        }
    },
);

export const deleteComment = createAsyncThunk<Response<null>, { comment_id: number }, { rejectValue: Response<null> }>(
    "comment/delete",
    async ({ comment_id }, thunkAPI) => {
        try {
            const response = await apis.commentApis.deleteComment(comment_id);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.data);
        }
    },
);
export const getCommentsWithPagination = createAsyncThunk<
    Response<null>,
    GetCommentsWithPagination,
    { rejectValue: Response<null> }
>("comment/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.commentApis.getCommentsWithPagination(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getCommentsWithPaginationByLectureId = createAsyncThunk<
    Response<null>,
    {lecture_id: number, values: GetCommentsWithPaginationByLectureId},
    { rejectValue: Response<null> }
>("comment/lectureId", async ({lecture_id, values}, ThunkAPI) => {
    try {
        const response = await apis.commentApis.getCommentsWithPaginationByLectureId(lecture_id, values);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getCommentsWithPaginationByCourseId = createAsyncThunk<
    Response<null>,
    {course_id: number, values: GetCommentsWithPaginationByLectureId},
    { rejectValue: Response<null> }
>("comment/courseId", async ({course_id, values}, ThunkAPI) => {
    try {
        const response = await apis.commentApis.getCommentsWithPaginationByCourseId(course_id, values);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
type CommentSliceType = {
    comment: CreateUpdateComment;
    comments: Comment[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
};
const initialState: CommentSliceType = {
    isLoading: false,
    isGetLoading: false,
    totalPage: 0,
    totalRecord: 0,
    comments: [],
    comment: {
        id: 0,
        content: "",
        created_at: "",
        updatedAt: "",
        user_id: 0,
        lecture_id: 0,
        likes_count: 0,
        dislikes_count: 0
    }
};

const replyCommentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setComment: (state, action) => {
              state.comment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createComment.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createComment.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(updateComment.pending, (state) => {
                state.isLoading = true;
                // state.isGetLoading = true;
            })
            .addCase(updateComment.fulfilled, (state) => {
                state.isLoading = false;
                // Handle fulfillment if needed
            })
            .addCase(updateComment.rejected, (state) => {
                state.isLoading = false;
                // Handle rejection if needed
            })
            .addCase(deleteComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteComment.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getCommentsWithPagination.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCommentsWithPagination.fulfilled, (state, action: any) => {
                state.comments = action.payload.data?.data as Comment[];
                state.totalPage = action.payload.data.total_page;
                state.totalRecord = action.payload.data.total_record;
                state.isLoading = false;
            })
            .addCase(getCommentsWithPagination.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getCommentsWithPaginationByLectureId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCommentsWithPaginationByLectureId.fulfilled, (state, action: any) => {
                state.comments = action.payload.data?.data as Comment[];
                state.totalPage = action.payload.data.total_page;
                state.totalRecord = action.payload.data.total_record;
                state.isLoading = false;
            })
            .addCase(getCommentsWithPaginationByLectureId.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getCommentsWithPaginationByCourseId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCommentsWithPaginationByCourseId.fulfilled, (state, action: any) => {
                state.comments = action.payload.data?.data as Comment[];
                state.totalPage = action.payload.data.total_page;
                state.totalRecord = action.payload.data.total_record;
                state.isLoading = false;
            })
            .addCase(getCommentsWithPaginationByCourseId.rejected, (state) => {
                state.isLoading = false;
            });
    },
});
export const {} = replyCommentSlice.actions;

export default replyCommentSlice.reducer;
