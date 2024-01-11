import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Invoice, InvoicePaging, PagingInvoice } from "../../types/invoice";

export const getInvoiceNow = createAsyncThunk<Response<Invoice>, void, { rejectValue: Response<null> }>(
    "invoice/",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.getInvoiceNow();
            return response.data as Response<Invoice>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getHistoryInvoices = createAsyncThunk<
  Response<PagingInvoice>,  // Kiểu dữ liệu bạn muốn nhận khi thành công
  InvoicePaging,             // Kiểu dữ liệu của tham số truyền vào
  { rejectValue: Response<null> }  // Kiểu dữ liệu của giá trị bị reject
>(
  "invoice/all",
  async (body, thunkAPI) => {
    try {
      const response = await apis.invoiceApis.getHistoryInvoices(body);
      return response.data as Response<PagingInvoice>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data as Response<null>);
    }
  },
);
export const createInvoice = createAsyncThunk<Response<null>, void, { rejectValue: Response<null> }>(
    "invoice/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.createInvoice();
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getInvoiceById = createAsyncThunk<Response<Invoice>, number, { rejectValue: Response<null> }>(
    "invoice/getInvoiceById",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.invoiceApis.getInvoiceById(body);
            return response.data as Response<Invoice>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

type InvoiceSliceType = {
    invoice: Invoice;
    invoices: Invoice[];
    totalPage: number;
    totalRecourd: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: InvoiceSliceType = {
    invoice: {
        id: 0,
        invoice_id: 0,
        user_id: 0,
        total_money: 0,
        is_success: false,
        created_at: "",
        invoice_items: [],
        invoice_detail: [],
    },
    invoices: [],
    totalPage: 0,
    totalRecourd: 0,
    isLoading: false,
    isGetLoading: false,
};
export const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getInvoiceNow.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getInvoiceNow.fulfilled, (state, action) => {
            state.invoice = action.payload.data as Invoice;
            state.isGetLoading = false;
        });
        builder.addCase(getInvoiceNow.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getHistoryInvoices.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getHistoryInvoices.fulfilled, (state, action) => {
            state.invoices = action.payload.data?.data as Invoice[];
            state.totalPage = action.payload.data?.total_page || 0;
            state.totalRecourd = action.payload.data?.total_record || 0;
            state.isGetLoading = false;
        });
        builder.addCase(getHistoryInvoices.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getInvoiceById.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getInvoiceById.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.invoice = action.payload.data as Invoice;
        });
        builder.addCase(getInvoiceById.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = invoiceSlice.actions;

export default invoiceSlice.reducer;
