import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import { Event, EventForSpin, GetEventsWithPagination } from "@/types/event";
import apis from "../../api";

export const createEvent = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "event/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.eventApis.createEvent(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
  );
  
export const updateEvent = createAsyncThunk<Response<null>,  {event_id: number, body: FormData}, { rejectValue: Response<null> }>(
    "event/update",
    async ({ event_id, body }, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
      try {
        const response = await apis.eventApis.updateEvent(event_id, body);
        return response.data as Response<null>;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data);
      }
    },
  );
  
export const deleteEvent = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "event/delete",
    async (body, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
      try {
        const response = await apis.eventApis.deleteEvent(body);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data);
      }
    },
  );
export const getEventById = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "event/getEventById",
    async (body, thunkAPI) => { // Change the parameter to underscore (_) to indicate it's unused
      try {
        const response = await apis.eventApis.getEventById(body);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.data);
      }
    },
  );
export const getEventsWithPagination = createAsyncThunk<
  Response<null>,
  GetEventsWithPagination,
  { rejectValue: Response<null> }
>("event/all", async (body, ThunkAPI) => {
  try {
      const response = await apis.eventApis.getEventsWithPagination(body);
      return response.data as Response<null>;
  } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>);
  }
});
export const getAllEvents = createAsyncThunk<Event[], void, { rejectValue: any }>(
  "event/allevent",
  async (body, thunkAPI) => {
    try {
      const response = await apis.eventApis.getAllEvents();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
export const getActiveEvent = createAsyncThunk<Response<EventForSpin>, void, { rejectValue: any }>(
  "event/activeevent",
  async (body, thunkAPI) => {
    try {
      const response = await apis.eventApis.getActiveEvent();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.data);
    }
  },
);
  type EventSliceType = {
    event: Event;
    eventForSpin: EventForSpin;
    events: Event[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
  };
  const initialState: EventSliceType = {
    isLoading: false,
    isGetLoading: false,
    totalPage: 0,
    totalRecord: 0,
    event: {
      event_id: 0,
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      is_active: 0,
      coupons: []
    },
    events: [],
    eventForSpin: {
      id: 0,
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      is_active: 0
    }
  };
  
  const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
      setEvent: (state, action) => {
        state.event = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createEvent.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createEvent.fulfilled, (state) => {
          state.isLoading = false;
          // Handle fulfillment if needed
        })
        .addCase(createEvent.rejected, (state) => {
          state.isLoading = false;
          // Handle rejection if needed
        })
        .addCase(updateEvent.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateEvent.fulfilled, (state) => {
          state.isLoading = false;
          // Handle fulfillment if needed
        })
        .addCase(updateEvent.rejected, (state) => {
          state.isLoading = false;
          // Handle rejection if needed
        })
        .addCase(deleteEvent.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteEvent.fulfilled, (state) => {
          state.isLoading = false;
          // Handle fulfillment if needed
        })
        .addCase(deleteEvent.rejected, (state) => {
          state.isLoading = false;
          // Handle rejection if needed
        })
        .addCase(getEventsWithPagination.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getEventsWithPagination.fulfilled, (state, action: any) => {
          state.events = action.payload.data?.data as Event[];
          state.totalPage = action.payload.data.total_page;
          state.totalRecord = action.payload.data.total_record;
          state.isLoading = false;
        })
        .addCase(getEventsWithPagination.rejected, (state) => {
          state.isLoading = false;
          // Handle rejection if needed
        })
        .addCase(getAllEvents.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllEvents.fulfilled, (state, action: any) => {
            state.events = action.payload.data as Event[];
            state.isLoading = false;
        })
        .addCase(getAllEvents.rejected, (state) => {
            state.isLoading = false;
            // Handle rejection if needed
        })
        .addCase(getEventById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getEventById.fulfilled, (state, action: any) => {
            state.event = action.payload.data as Event;
            state.isLoading = false;
        })
        .addCase(getEventById.rejected, (state) => {
            state.isLoading = false;
            // Handle rejection if needed
        })
        .addCase(getActiveEvent.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getActiveEvent.fulfilled, (state, action: any) => {
            state.eventForSpin = action.payload.data as EventForSpin;
            state.isLoading = false;
        })
        .addCase(getActiveEvent.rejected, (state) => {
            state.isLoading = false;
            // Handle rejection if needed
        });
    },
  });
  
  export const {setEvent} = eventSlice.actions;
  
  export default eventSlice.reducer;
  