import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Feedback, FeedbackContent, GetAllFeedback } from "../../types/feedback";
import apis from "../../api";
type FeedbackSliceType = {
    feedbacks: Feedback[];
    feedback: Feedback;
    isGetLoading: boolean;
    totalPage: number;
    averageRating: number;
    totalRecord: number;
};

export const getAllFeedbacks = createAsyncThunk<Response<Feedback[]>, GetAllFeedback, { rejectValue: Response<null> }>(
    "feedback/all",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.feedbackApis.getAllFeedbacks(body);
            return response.data as Response<Feedback[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createMyFeedback = createAsyncThunk<Response<Feedback>, FeedbackContent, { rejectValue: Response<null> }>(
    "feedback/",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.feedbackApis.createMyFeedback(body);
            return response.data as Response<Feedback>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: FeedbackSliceType = {
    feedbacks: [],
    feedback:{
        feedback_id: 0,
        user_id: 0,
        first_name: "",
        last_name: "",
        url_avatar: "",
        content: "",
        created_at: "",
        score: 0,
    },
    totalPage: 0,
    totalRecord: 0,
    averageRating: 0,
    isGetLoading: false,
};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFeedbacks.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllFeedbacks.fulfilled, (state, action: any) => {
            state.feedbacks = action.payload.data.data as Feedback[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.averageRating = action.payload.data.average_rating;
            state.isGetLoading = false;
        });
        builder.addCase(getAllFeedbacks.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createMyFeedback.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(createMyFeedback.fulfilled, (state, action: any) =>{
            state.feedback = action.payload.data as Feedback;
            state.isGetLoading = false;
        });
        builder.addCase(createMyFeedback.rejected, (state)=> {
            state.isGetLoading = false;
        })
    },
});

export const {} = feedbackSlice.actions;

export default feedbackSlice.reducer;
