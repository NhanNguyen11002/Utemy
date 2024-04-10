import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import { DecisionType } from "../../types/decision";
type DecisionSliceType = {
    decisions: DecisionType[];
    isLoading: boolean;
    isGetLoading: boolean;
};

export const getDecisionsByCourseId = createAsyncThunk<
    Response<DecisionType[]>,
    number,
    { rejectValue: Response<null> }
>("decision/get", async (body, ThunkAPI) => {
    try {
        const response = await apis.decisionApis.getDecisionsByCourseId(body);
        return response.data as Response<DecisionType[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
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
export const handleDecision = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "decision/handle",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.decisionApis.handleDecision(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const uploadEvidence = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "decision/evidence",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.decisionApis.uploadEvidence(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: DecisionSliceType = {
    decisions: [],
    isGetLoading: false,
    isLoading: false,
};

export const decisionSlice = createSlice({
    name: "decision",
    initialState,
    reducers: {
        setHandleDecision: (state, action) => {
            console.log(action.payload);
            const index = state.decisions.findIndex((e: DecisionType) => e.decision_id === action.payload);
            console.log(index);
            console.log(state.decisions[index]);
            state.decisions[index].is_handle = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getDecisionsByCourseId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getDecisionsByCourseId.fulfilled, (state, action: any) => {
            state.decisions = action.payload.data as DecisionType[];
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
        builder.addCase(handleDecision.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(handleDecision.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(handleDecision.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(uploadEvidence.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(uploadEvidence.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(uploadEvidence.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setHandleDecision } = decisionSlice.actions;

export default decisionSlice.reducer;
