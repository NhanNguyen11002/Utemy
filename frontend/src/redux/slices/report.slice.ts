import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { GetReportByCourseIdType, ReportType, CreateReport } from "../../types/report";
import apis from "../../api";
type ReportSliceType = {
    reports: ReportType[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

export const getReportByCourseId = createAsyncThunk<
    Response<any>,
    GetReportByCourseIdType,
    { rejectValue: Response<null> }
>("report/get", async (body, ThunkAPI) => {
    try {
        const response = await apis.reportApis.getReportByCourseId(body);
        return response.data as Response<any>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getAllReportWithPagination = createAsyncThunk<Response<any>, any, { rejectValue: Response<null> }>(
    "report/get/all",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.reportApis.getAllReportWithPagination(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createReport = createAsyncThunk<Response<null>, CreateReport, { rejectValue: Response<null> }>(
    "report/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.reportApis.createReport(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const handleReport = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "report/handle",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.reportApis.handleReport(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: ReportSliceType = {
    reports: [],
    totalPage: 0,
    totalRecord: 0,
    isGetLoading: false,
    isLoading: false,
};

export const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        setHandleReport: (state, action) => {
            const index = state.reports.findIndex((e: ReportType) => e.report_id === action.payload);
            state.reports[index].is_handle = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getReportByCourseId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getReportByCourseId.fulfilled, (state, action) => {
            state.reports = action.payload.data.data as ReportType[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getReportByCourseId.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getAllReportWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllReportWithPagination.fulfilled, (state, action) => {
            state.reports = action.payload.data.data as ReportType[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllReportWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createReport.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createReport.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(createReport.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(handleReport.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(handleReport.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(handleReport.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setHandleReport } = reportSlice.actions;

export default reportSlice.reducer;
