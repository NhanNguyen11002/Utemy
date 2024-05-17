import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Coupon, VoucherDropdown } from "@/types/coupon";
import apis from "../../api";
import { GetCouponsWithPagination } from "@/types/coupon";

// interface CouponState {
//   isLoading: boolean;
//   eventCoupons: Coupon[];
// }


export const createCouponOwner = createAsyncThunk<Response<null>, { coupon_id: number, event_id: number }, { rejectValue: Response<null> }>(
  "coupon/hunt",
  async ({ coupon_id, event_id }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.createCouponOwner(coupon_id, event_id);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);

export const createHistoryForGoodLuckNextTime = createAsyncThunk<Response<null>, { event_id: number }, { rejectValue: Response<null> }>(
  "coupon/good-luck",
  async ({ event_id }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.createHistoryForGoodLuckNextTime(event_id);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);


export const getAllEventCoupon = createAsyncThunk<Coupon[], void, { rejectValue: any }>(
  "coupon/all-event",
  async (body, thunkAPI) => {
    try {
      const response = await apis.couponApis.getAllEventCoupon();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);

export const getAllEventCouponByEventId = createAsyncThunk<Coupon[], number, { rejectValue: any }>(
  "coupon/all-coupon-event",
  async (body, thunkAPI) => {
    try {
      const response = await apis.couponApis.getAllEventCouponByEventId(body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const getVoucherBySpin = createAsyncThunk<VoucherDropdown[], void, { rejectValue: Response<null> }>(
  "coupon/getVoucherBySpin",
  async (body, thunkAPI) => {
      try {
          const response = await apis.couponApis.getVoucherBySpin();
          return response.data;
      } catch (error: any) {
          return thunkAPI.rejectWithValue(error.data);
      }
  },
);

export const getHistorySpinOfUserForAEvent = createAsyncThunk<Response<null>, number, { rejectValue: any }>(
  "coupon/spin-history",
  async (body, thunkAPI) => {
    try {
      const response = await apis.couponApis.getHistorySpinOfUserForAEvent(body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const createCoupon = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
  "coupon/create",
  async (body, ThunkAPI) => {
      try {
          const response = await apis.couponApis.createCoupon(body);
          return response.data as Response<null>;
      } catch (error: any) {
          return ThunkAPI.rejectWithValue(error.data as Response<null>);
      }
  },
);

export const updateCoupon = createAsyncThunk<Response<null>,  {coupon_id: number, body: FormData}, { rejectValue: Response<null> }>(
  "coupon/update",
  async ({ coupon_id, body }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.updateCoupon(coupon_id, body);
      return response.data as Response<null>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);

export const deleteCoupon = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
  "coupon/delete",
  async (body, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.deleteCoupon(body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const getCouponById = createAsyncThunk<Response<Coupon>, number, { rejectValue: Response<null> }>(
  "coupon/getCouponById",
  async (id, thunkAPI) => {
      try {
          const response = await apis.couponApis.getCouponById(id);
          return response.data as Response<Coupon>;
      } catch (error: any) {
          return thunkAPI.rejectWithValue(error.data as Response<null>);
      }
  },
);

// export const getAllCoupon = createAsyncThunk<Coupon[], void, { rejectValue: any }>(
//   "coupon/all",
//   async (body, thunkAPI) => {
//     try {
//       const response = await apis.couponApis.getAllCoupon();
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.data);
//     }
//   },
// );
export const getCouponsWithPagination = createAsyncThunk<
    Response<null>,
    GetCouponsWithPagination,
    { rejectValue: Response<null> }
>("coupon/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.couponApis.getCouponsWithPagination(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const createRatio = createAsyncThunk<Response<null>, { coupon_id: number, ratio: number }, { rejectValue: Response<null> }>(
  "coupon/ratio/create",
  async ({ coupon_id, ratio }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.createRatio(coupon_id, ratio);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const updateRatio = createAsyncThunk<Response<null>, { coupon_id: number, ratio: number }, { rejectValue: Response<null> }>(
  "coupon/ratio/update",
  async ({ coupon_id, ratio }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.updateRatio(coupon_id, ratio);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const deleteRatio = createAsyncThunk<Response<null>, { coupon_id: number }, { rejectValue: Response<null> }>(
  "coupon/ratio/delete",
  async ({ coupon_id }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
    try {
      const response = await apis.couponApis.deleteRatio(coupon_id);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
type CouponSliceType = {
  coupon: Coupon;
  coupons: Coupon[];
  totalPage: number;
  totalRecord: number;
  isLoading: boolean;
  isGetLoading: boolean;
  eventCoupons: Coupon[];
  eventCPRatio: Coupon[];
  voucherDropdown: VoucherDropdown[]
};
const initialState: CouponSliceType = {
  isLoading: false,
  isGetLoading: false,
  eventCoupons: [],
  coupon: {
    coupon_id: 0,
    code: "",
    discount: 0,
    valid_until: "",
    valid_start: "",
    remain_quantity: 0,
    is_event: false,
    max_discount_money: 0,
    event_id: null,
    event_name: null,
    ratio: null
  },
  coupons: [],
  totalPage: 0,
  totalRecord: 0,
  voucherDropdown: [],
  eventCPRatio: []
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupon: (state, action) => {
      state.coupon = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEventCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEventCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventCoupons = action.payload;
      })
      .addCase(getAllEventCoupon.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(getAllEventCouponByEventId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEventCouponByEventId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventCPRatio = action.payload;
      })
      .addCase(getAllEventCouponByEventId.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(getCouponById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCouponById.fulfilled, (state, action) => {
        state.coupon = action.payload.data as Coupon;
        state.isLoading = false;
      })
      .addCase(getCouponById.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(createCouponOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCouponOwner.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(createCouponOwner.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(createHistoryForGoodLuckNextTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHistoryForGoodLuckNextTime.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(createHistoryForGoodLuckNextTime.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCoupon.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(createCoupon.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCoupon.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(updateCoupon.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state) => {
        state.isLoading = false;
        // Handle fulfillment if needed
      })
      .addCase(deleteCoupon.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(getCouponsWithPagination.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCouponsWithPagination.fulfilled, (state, action: any) => {
        state.coupons = action.payload.data?.data as Coupon[];
        state.totalPage = action.payload.data.total_page;
        state.totalRecord = action.payload.data.total_record;
        state.isLoading = false;
      })
      .addCase(getCouponsWithPagination.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(getHistorySpinOfUserForAEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHistorySpinOfUserForAEvent.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getHistorySpinOfUserForAEvent.rejected, (state) => {
        state.isLoading = false;
        // Handle rejection if needed
      })
      .addCase(getVoucherBySpin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVoucherBySpin.fulfilled, (state, action: any) => {
        state.voucherDropdown = action.payload.data as VoucherDropdown[];
        state.isLoading = false;
      })
      .addCase(getVoucherBySpin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createRatio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRatio.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createRatio.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateRatio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRatio.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateRatio.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteRatio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRatio.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteRatio.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export const { setCoupon } = couponSlice.actions;

export default couponSlice.reducer;

