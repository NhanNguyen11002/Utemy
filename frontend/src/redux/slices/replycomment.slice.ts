import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import { GetCommentsWithPagination } from "@/types/comment";


export const createReplyComment = createAsyncThunk<Response<null>, {content: string; comment_id: number}, { rejectValue: Response<null> }>(
  "reply/create",
  async ({content, comment_id}, ThunkAPI) => {
      try {
          const response = await apis.replyCommentApis.createReplyComment(content, comment_id);
          return response.data as Response<null>;
      } catch (error: any) {
          return ThunkAPI.rejectWithValue(error.data as Response<null>);
      }
  },
);

export const updateReplyComment = createAsyncThunk<Response<null>,  {reply_id: number, content: string}, { rejectValue: Response<null> }>(
  "reply/update",
  async ({ reply_id, content }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.replyCommentApis.updateReplyComment(reply_id, content);
      return response.data as Response<null>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);

export const deleteReplyComment = createAsyncThunk<Response<null>, {reply_id: number}, { rejectValue: Response<null> }>(
  "reply/delete",
  async ({reply_id}, thunkAPI) => { 
    try {
      const response = await apis.replyCommentApis.deleteReplyComment(reply_id);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const getReplyCommentsWithPagination = createAsyncThunk<
    Response<null>,
    GetCommentsWithPagination,
    { rejectValue: Response<null> }
>("reply/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.replyCommentApis.getReplyCommentsWithPagination(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
type CouponSliceType = {
  totalPage: number;
  totalRecord: number;
  isLoading: boolean;
  isGetLoading: boolean;
};
const initialState: CouponSliceType = {
  isLoading: false,
  isGetLoading: false,
  totalPage: 0,
  totalRecord: 0,
};

const replyCommentSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupon: (state, action) => {
    //   state.coupon = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReplyComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReplyComment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createReplyComment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateReplyComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReplyComment.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(updateReplyComment.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(deleteReplyComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReplyComment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReplyComment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getReplyCommentsWithPagination.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReplyCommentsWithPagination.fulfilled, (state, action: any) => {
        // state.coupons = action.payload.data?.data as Coupon[];
        state.totalPage = action.payload.data.total_page;
        state.totalRecord = action.payload.data.total_record;
        state.isLoading = false;
      })
      .addCase(getReplyCommentsWithPagination.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {  } = replyCommentSlice.actions;

export default replyCommentSlice.reducer;

