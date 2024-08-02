import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";


export const createLike = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
  "reaction/create-like",
  async ({comment_id, reply_id}, ThunkAPI) => {
      try {
          const response = await apis.reactionApis.createLike(comment_id, reply_id);
          return response.data as Response<null>;
      } catch (error: any) {
          return ThunkAPI.rejectWithValue(error.data as Response<null>);
      }
  },
);


export const deleteLike = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
  "reaction/delete-like",
  async ({comment_id, reply_id}, thunkAPI) => { 
    try {
      const response = await apis.reactionApis.deleteLike(comment_id, reply_id);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data as Response<null>);
    }
  },
);

export const createDislike = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
    "reaction/create-dislike",
    async ({comment_id, reply_id}, ThunkAPI) => {
        try {
            const response = await apis.reactionApis.createDislike(comment_id, reply_id);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
  );
  
  
  export const deleteDislike = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
    "reaction/delete-dislike",
    async ({comment_id, reply_id}, thunkAPI) => { 
      try {
        const response = await apis.reactionApis.deleteDislike(comment_id, reply_id);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data as Response<null>);
      }
    },
  );
  export const checkLikeExist = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
    "reaction/existlike",
    async ({comment_id, reply_id}, thunkAPI) => { 
      try {
        const response = await apis.reactionApis.checkLikeExist(comment_id, reply_id);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data);
      }
    },
  );
  export const checkDislikeExist = createAsyncThunk<Response<null>, {comment_id: number; reply_id: number | null}, { rejectValue: Response<null> }>(
    "reaction/existdislike",
    async ({comment_id, reply_id}, thunkAPI) => { 
      try {
        const response = await apis.reactionApis.checkDislikeExist(comment_id, reply_id);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data);
      }
    },
  );
type ReactionSliceType = {
  isLoading: boolean;
  isGetLoading: boolean;
};
const initialState: ReactionSliceType = {
  isLoading: false,
  isGetLoading: false,
};

const reactionSlice = createSlice({
  name: 'reaction',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLike.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createLike.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLike.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteLike.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDislike.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createDislike.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDislike.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteDislike.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkLikeExist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkLikeExist.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkLikeExist.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkDislikeExist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkDislikeExist.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkDislikeExist.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {  } = reactionSlice.actions;

export default reactionSlice.reducer;

