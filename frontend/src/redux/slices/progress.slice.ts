import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Progress as ProgressType } from "../../types/progress";
import apis from "../../api";
type ProgressSliceType = {
    overallProgress: number;
    progress: Map<number, ProgressType>;
    progressOfSection: Map<number, number>;
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
    progress: new Map<number, ProgressType>(),
    progressOfSection: new Map<number, number>(),
    isGetLoading: false,
    isLoading: false,
};

export const ProgressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        setUpdateProgress: (state, action) => {
            const currentState = state.progress.get(action.payload);
            if (currentState) {
                const updateState: ProgressType = { ...currentState, is_pass: true } as ProgressType;
                state.progress.set(action.payload, updateState);
                const temp = state.progressOfSection.get(currentState?.section_id as number);
                state.progressOfSection.set(currentState?.section_id, temp ? temp + 1 : 1);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProgressByCourseSlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getProgressByCourseSlug.fulfilled, (state, action: any) => {
            let temp = new Map<number, ProgressType>();
            let temp2 = new Map<number, number>();
            action.payload.data.progress.forEach((progress: ProgressType) => {
                temp.set(progress.lecture_id, progress);
                const valueOfKey = temp2.get(progress.section_id);
                temp2.set(progress.section_id, valueOfKey ? valueOfKey + 1 : 1);
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
        });
        builder.addCase(updateProgress.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setUpdateProgress } = ProgressSlice.actions;

export default ProgressSlice.reducer;
