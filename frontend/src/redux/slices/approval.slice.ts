import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import { ApprovalCard, GetApproval } from "../../types/approval";
type ApprovalSliceType = {
    approvals: ApprovalCard[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

export const getApprovalsWithPagenation = createAsyncThunk<
    Response<ApprovalCard[]>,
    GetApproval,
    { rejectValue: Response<null> }
>("approval/get", async (body, ThunkAPI) => {
    try {
        const response = await apis.approvalApis.getApprovalsWithPagenation(body);
        return response.data as Response<ApprovalCard[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const createApproval = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "approval/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.approvalApis.createApproval(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: ApprovalSliceType = {
    approvals: [],
    totalPage: 0,
    totalRecord: 0,
    isGetLoading: false,
    isLoading: false,
};

export const approvalSlice = createSlice({
    name: "approval",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getApprovalsWithPagenation.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getApprovalsWithPagenation.fulfilled, (state, action: any) => {
            state.approvals = action.payload.data.data as ApprovalCard[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getApprovalsWithPagenation.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createApproval.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createApproval.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(createApproval.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = approvalSlice.actions;

export default approvalSlice.reducer;
