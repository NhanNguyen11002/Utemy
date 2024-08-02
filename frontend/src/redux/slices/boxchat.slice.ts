import { Response } from "../../types/response";
import apis from "../../api";
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const submitQuestion = createAsyncThunk<Response<any>, { content: string }, { rejectValue: Response<null> }>(
    "boxchat/submit-question",
    async ({content}, ThunkAPI) => {
        try {
            const response = await apis.boxChatApis.submitQuestion(content);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const checkValidateComment = createAsyncThunk<Response<any>, { content: string }, { rejectValue: Response<null> }>(
    "boxchat/check-comment",
    async ({content}, ThunkAPI) => {
        try {
            const response = await apis.boxChatApis.checkValidateComment(content);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
type BoxChatSliceType = {
    answer: string | null;
    isValid: boolean;
    isLoading: boolean;
    isGetLoading: boolean;
};
const initialState: BoxChatSliceType = {
    answer: "",
    isLoading: false,
    isGetLoading: false,
    isValid: false
}
export const boxChatSlice = createSlice({
    name: "boxchat",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(submitQuestion.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(submitQuestion.fulfilled, (state, action) => {
            state.answer = action.payload.data.answer;
            state.isGetLoading = false;
        });
        builder.addCase(submitQuestion.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(checkValidateComment.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(checkValidateComment.fulfilled, (state, action) => {
            state.isValid = action.payload.data.isValid;
            state.isGetLoading = false;
        });
        builder.addCase(checkValidateComment.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = boxChatSlice.actions;

export default boxChatSlice.reducer;
