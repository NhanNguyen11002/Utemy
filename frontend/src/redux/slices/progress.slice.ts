import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Progress as ProgressType } from "../../types/progress";
import apis from "../../api";
type ProgressSliceType = {
    overallProgress: number;
    progress: any;
    progressOfSection: any;
    isLoading: boolean;
    isGetLoading: boolean;
};

export const getProgressByCourseSlug = createAsyncThunk<Response<any>, any, { rejectValue: Response<null> }>(
    "progress/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.progressApis.getProgressByCourseSlug(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateProgress = createAsyncThunk<Response<null>, any, { rejectValue: Response<null> }>(
    "progress/update",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.progressApis.updateProgress(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

const initialState: ProgressSliceType = {
    overallProgress: 0,
    progress: {},
    progressOfSection: {},
    isGetLoading: false,
    isLoading: false,
};

export const ProgressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        setUpdateProgress: (state, action) => {
            if (action.payload.message === "Create data successfully") {
                const data = action.payload.data as ProgressType;
                const copyProgress = { ...state.progress[data.lecture_id], ...data };
                const copy = { ...state.progress, copyProgress };
                state.progress = copy;
                if (data.is_pass) {
                    const valueOfKey = state.progressOfSection[data.section_id];
                    state.progressOfSection[data.section_id] = valueOfKey ? valueOfKey + 1 : 1;
                }
            }
            if (action.payload.message === "Update data successfully") {
                const data = action.payload.data as ProgressType;
                const copyProgress = { ...state.progress[data.lecture_id], ...data };
                const copy = { ...state.progress, copyProgress };
                state.progress = copy;
                if (data.is_pass) {
                    const valueOfKey = state.progressOfSection[data.section_id];
                    state.progressOfSection[data.section_id] = valueOfKey ? valueOfKey + 1 : 1;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProgressByCourseSlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getProgressByCourseSlug.fulfilled, (state, action: any) => {
            let temp: any = {};
            let temp2: any = {};
            action.payload.data.progress.forEach((progress: ProgressType) => {
                temp[progress.lecture_id] = progress;
                if (progress.is_pass) {
                    const valueOfKey = temp2[progress.section_id];
                    temp2[progress.section_id] = valueOfKey ? valueOfKey + 1 : 1;
                }
            });
            state.progress = temp;
            state.progressOfSection = temp2;
            state.overallProgress = action.payload.data.overall_progress;
            state.isGetLoading = false;
        });
        builder.addCase(getProgressByCourseSlug.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(updateProgress.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateProgress.fulfilled, (state, action: any) => {
            state.isLoading = false;
            if (action.payload.status_code === 200) {
                if (action.payload.message === "Create data successfully") {
                    const data = action.payload.data as ProgressType;
                    const copyProgress = { ...state.progress[data.lecture_id], ...data };
                    const copy = { ...state.progress, copyProgress };
                    state.progress = copy;
                    if (data.is_pass) {
                        const valueOfKey = state.progressOfSection[data.section_id];
                        state.progressOfSection[data.section_id] = valueOfKey ? valueOfKey + 1 : 1;
                    }
                }
                if (action.payload.message === "Update data successfully") {
                    const data = action.payload.data as ProgressType;
                    const copyProgress = { ...state.progress[data.lecture_id], ...data };
                    const copy = { ...state.progress, copyProgress };
                    state.progress = copy;
                    if (data.is_pass) {
                        const valueOfKey = state.progressOfSection[data.section_id];
                        state.progressOfSection[data.section_id] = valueOfKey ? valueOfKey + 1 : 1;
                    }
                }
            }
        });
        builder.addCase(updateProgress.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setUpdateProgress } = ProgressSlice.actions;

export default ProgressSlice.reducer;
