import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
type ReportSliceType = {
    decisions: any;
    isLoading: boolean;
    isGetLoading: boolean;
};

export const getDecisionsByCourseId = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "decision/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.decisionApis.getDecisionsByCourseId(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createDecision = createAsyncThunk<Response<null>, any, { rejectValue: Response<null> }>(
    "decision/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.decisionApis.createDecision(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: ReportSliceType = {
    decisions: [],
    isGetLoading: false,
    isLoading: false,
};

export const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDecisionsByCourseId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getDecisionsByCourseId.fulfilled, (state, action: any) => {
            state.decisions = action.payload.data.data as any[];
            state.isGetLoading = false;
        });
        builder.addCase(getDecisionsByCourseId.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createDecision.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createDecision.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(createDecision.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = reportSlice.actions;

export default reportSlice.reducer;
