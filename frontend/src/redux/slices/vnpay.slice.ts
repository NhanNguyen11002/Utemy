import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPaymentUrl as createPaymentUrlType } from "../../types/vnpay";

export const createPaymentUrl = createAsyncThunk<
    Response<string>,
    createPaymentUrlType,
    { rejectValue: Response<null> }
>("vnpay/get", async (body, ThunkAPI) => {
    try {
        const response = await apis.vnpayApis.createPaymentUrl(body);
        return response.data as Response<string>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const vnpayIpn = createAsyncThunk<Response<any>, any, { rejectValue: Response<null> }>(
    "vnpay/ipn",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.vnpayApis.vnpayIpn(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
type VnpaySliceType = {
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: VnpaySliceType = {
    isLoading: false,
    isGetLoading: false,
};

export const vnpaySlice = createSlice({
    name: "vnpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createPaymentUrl.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(createPaymentUrl.fulfilled, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createPaymentUrl.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(vnpayIpn.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(vnpayIpn.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(vnpayIpn.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = vnpaySlice.actions;

export default vnpaySlice.reducer;
