import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
type ApprovalSliceType = {
    isLoading: boolean;
};

export const sendCertifier = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "certifier/send",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.certifierApis.sendCertifier(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: ApprovalSliceType = {
    isLoading: false,
};

export const approvalSlice = createSlice({
    name: "certifier",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sendCertifier.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(sendCertifier.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(sendCertifier.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = approvalSlice.actions;

export default approvalSlice.reducer;
