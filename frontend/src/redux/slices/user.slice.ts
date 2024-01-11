import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import {
    User,
    GetAllUser,
    CreateNewUser as CreateNewUserType,
    AuthorInformation,
    UpdateInformation,
    EditUser,
} from "../../types/user";
import apis from "../../api";
import { Course } from "../../types/course";

type UserSliceType = {
    users: User[];
    courses: Course[];
    user: User;
    isLoading: boolean;
    isGetLoading: boolean;
    totalPage: number;
    totalRecord: number;
};
export const getAllUsersWithPagination = createAsyncThunk<Response<null>, GetAllUser, { rejectValue: Response<null> }>(
    "user/all",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.getAllUsersWithPagination(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createNewUser = createAsyncThunk<Response<null>, CreateNewUserType, { rejectValue: Response<null> }>(
    "user/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.createNewUser(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const editUser = createAsyncThunk<Response<null>, EditUser, { rejectValue: Response<null> }>(
    "user/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.editUser(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteUser = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "user/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.deleteUser(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const activeUser = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "user/active",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.activeUser(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getProfile = createAsyncThunk<Response<User>, null, { rejectValue: Response<null> }>(
    "user/profile",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.getProfile();
            return response.data as Response<User>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const changeAvatar = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "user/avatar",
    async (formData, ThunkAPI) => {
        try {
            // Không cần tạo FormData ở đây, vì đã được thực hiện trong hàm changeAvatar
            const response = await apis.userApis.changeAvatar(formData);

            // Kiểm tra xem response có tồn tại không
            if (response) {
                return response.data as Response<null>;
            } else {
                // Nếu response là undefined, reject với giá trị lỗi tương ứng
                return ThunkAPI.rejectWithValue({
                    status_code: 500,
                    data: null,
                    success: false,
                    message: "Undefined",
                });
            }
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getAuthorProfile = createAsyncThunk<Response<AuthorInformation>, number, { rejectValue: Response<null> }>(
    "user/getAuthorProfile",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.getAuthorProfile(body);
            return response.data as Response<AuthorInformation>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

export const updateProfile = createAsyncThunk<Response<User>, UpdateInformation, { rejectValue: Response<null> }>(
    "user/update-profile",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.userApis.updateProfile(body);
            return response.data as Response<User>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

const initialState: UserSliceType = {
    courses: [
        {
            course_id: 0,
            title: "",
            summary: "",
            number_of_rating: 0,
            thumbnail: "",
            description: "",
            author: {
                email: "",
                first_name: "",
                last_name: "",
                description: "",
                user_id: 0,
            },
            categories: [],
            number_of_section: 0,
            status: false,
            number_of_enrolled: 0,
            slug: "",
            price: 0,
            sale_price: 0,
            sale_until: "",
            average_rating: 0,
            created_at: "",
        },
    ],
    users: [],
    user: {
        user_id: 0,
        url_avatar: "",
        //password: "",
        first_name: "",
        last_name: "",
        email: "",
        description: "",
        is_admin: false,
    },
    isLoading: false,
    isGetLoading: false,
    totalPage: 0,
    totalRecord: 0,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUsersWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllUsersWithPagination.fulfilled, (state, action: any) => {
            state.users = action.payload.data?.data as User[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllUsersWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createNewUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createNewUser.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(createNewUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state, action: any) => {
            state.isLoading = false;
        });
        builder.addCase(deleteUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getProfile.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.user = action.payload.data as User;
        });
        builder.addCase(getProfile.rejected, (state) => {
            state.isGetLoading = false;
        });

        builder.addCase(getAuthorProfile.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAuthorProfile.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.user = action.payload.data?.user as User;
            state.courses = action.payload.data?.courses as Course[];
        });
        builder.addCase(getAuthorProfile.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(changeAvatar.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(changeAvatar.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changeAvatar.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(activeUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(activeUser.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(activeUser.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editUser.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editUser.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
