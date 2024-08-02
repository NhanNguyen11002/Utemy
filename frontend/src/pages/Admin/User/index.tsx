import React, { useState, useRef, useEffect } from "react";
import { DefaultAvatar as Logo } from "../../../assets/images";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { userActions } from "../../../redux/slices";
import DeleteUserModal from "./DeleteUserModal";
import ActiveUserModal from "./ActiveUserModal";
import { User } from "../../../types/user";
import toast from "react-hot-toast";
import PopupEditUser from "./PopupEditUser";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { GripIcon } from "lucide-react";

const UserAdmin = () => {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenActiveModal, setIsOpenActiveModal] = useState(false);
    const [isOpenEditUserPopup, setIsOpenEditUserPopup] = useState(false);
    const [userId, setUserId] = useState(0);
    const [editUser, setEditUser] = useState<User>({
        first_name: "",
        email: "",
        user_id: 0,
        last_name: "",
        description: "",
        is_admin: undefined,
        is_delete: undefined,
    });
    const dispatch = useAppDispatch();
    const currentId = useAppSelector((state) => state.authSlice.user.user_id);
    const users = useAppSelector((state) => state.userSlice.users);
    const totalPage = useAppSelector((state) => state.userSlice.totalPage);
    // const totalRecord = useAppSelector((state) => state.userSlice.totalRecord);
    const [userInput, setUserInput] = useState<string>("");
    const [searchItem, setSearchItem] = useState("");
    const [role, setRole] = useState("All");
    const [pageIndex, setPageIndex] = useState(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleCancelDeleteModal = () => {
        setIsOpenDeleteModal(false);
    };
    const handleOpenDeleteModal = (id: number) => {
        setUserId(id);
        setIsOpenDeleteModal(true);
    };
    const handleCancelActiveModal = () => {
        setIsOpenActiveModal(false);
    };
    const handleOpenActiveModal = (id: number) => {
        setUserId(id);
        setIsOpenActiveModal(true);
    };
    const handleCancelEditUserPopup = () => {
        setIsOpenEditUserPopup(false);
    };
    const handleOpenEditUserPopup = (user: any) => {
        setEditUser(user);
        setIsOpenEditUserPopup(true);
    };
    const handleActive = () => {
        dispatch(userActions.activeUser(userId)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ pageIndex: 1, searchItem: "", role: "All" }));
                setIsOpenActiveModal(false);
            } else if (response.payload) toast.error(response.payload.message);
        });
    };
    const handleDelete = () => {
        dispatch(userActions.deleteUser(userId)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ pageIndex: 1, searchItem: "", role: "All" }));
                setIsOpenDeleteModal(false);
            } else if (response.payload) toast.error(response.payload.message);
        });
    };

    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
        setRole("All");
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
        setUserInput("");
    };
    useEffect(() => {
        dispatch(userActions.getAllUsersWithPagination({ pageIndex, searchItem, role }));
    }, [dispatch, pageIndex]);
    useEffect(() => {
        dispatch(userActions.getAllUsersWithPagination({ pageIndex: 1, searchItem, role }));
    }, [dispatch, searchItem, role]);
    return (
        <>
            {isOpenDeleteModal && (
                <DeleteUserModal handleCancel={handleCancelDeleteModal} handleDelete={handleDelete} />
            )}
            {isOpenActiveModal && (
                <ActiveUserModal handleCancel={handleCancelActiveModal} handleActive={handleActive} />
            )}
            {isOpenEditUserPopup && (
                <PopupEditUser handleCancelEditUser={handleCancelEditUserPopup} editUser={editUser} />
            )}
            <div className="mt-12 mb-8 flex flex-col gap-12 bg-background_2 min-h-screen">
                <div className=" p-6 flex justify-center w-full self-center">
                    <div className="flex items-center justify-center gap-3 text-start w-2/3">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button className="bg-black min-w-[80px] text-white hover:text-gray-200 text-sm text-center px-4 py-1 rounded-sm">
                                    {role}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    id="All"
                                    className="text-black hover:bg-gray-400 cursor-pointer flex items-center justify-center"
                                    onClick={() => setRole("All")}
                                >
                                    <p>Tất cả</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    id="Admin"
                                    className="text-black hover:bg-gray-400 cursor-pointer flex items-center justify-center"
                                    onClick={() => setRole("Admin")}
                                >
                                    <p>Admin</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    id="User"
                                    className="text-black hover:bg-gray-400 cursor-pointer flex items-center justify-center"
                                    onClick={() => setRole("User")}
                                >
                                    <p>User</p>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="w-1/2">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="search-user"
                                    placeholder="Search user..."
                                    className="rounded py-2 px-10 w-full border-[1px] text-gray-700 border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleKeyWordSearch();
                                    }}
                                />
                                <div className="cursor-pointer absolute bottom-12" onClick={handleKeyWordSearch}>
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <div className="ml-2 gap-2 flex">
                            <button
                                onClick={() => handleKeyWordSearch()}
                                className="btn btn-sm btn-info text-white text-sm hover:bg-lightblue/80 font-w mb-1"
                            >
                                Tìm kiếm
                            </button>{" "}
                            <button onClick={() => handleReset()} className="text-sm btn-sm btn btn-outline font-w ">
                                Làm mới
                            </button>{" "}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-scroll px-0 pt-0 pb-2 ">
                    {users.length === 0 ? (
                        <p className="text-center">
                            Không tìm thấy user với từ khoá <span className="italic">"{searchItem}"</span>
                        </p>
                    ) : (
                        <Table className="border">
                            <TableCaption>Danh sách tài khoản</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {["Người dùng", "Loại tài khoản", "Trạng thái", "Ngày tạo", "Hành động"].map(
                                        (header, index) => (
                                            <TableHead
                                                key={index}
                                                className={`border ${index === 0 ? "text-left" : index === 4 ? "text-right" : "text-center"}`}
                                            >
                                                {header}
                                            </TableHead>
                                        ),
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => {
                                    const date = user.created_at?.toString().split(" ");
                                    const id = user.user_id as number;
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium border">
                                                <Link to={`/admin/user-profile/${user.user_id}`}>
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={user.url_avatar || Logo}
                                                            alt={user.user_id?.toString()}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <p
                                                                className={`font-semibold text-sm${
                                                                    user.user_id === currentId ? "text-lightblue" : ""
                                                                }`}
                                                            >
                                                                {user.first_name} {user.last_name}
                                                            </p>
                                                            <p className="text-xs font-normal text-blue-gray-500">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="border text-center">
                                                {" "}
                                                <div
                                                    className={` text-xs font-semibold ${
                                                        user.is_admin
                                                            ? "badge badge-info badge-outline"
                                                            : "badge badge-outline"
                                                    } `}
                                                >
                                                    {user.is_admin ? "Admin" : "User"}
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={`border text-center text-[11px] font-medium ${
                                                    user.is_delete ? "text-red-700" : "text-green-700"
                                                }`}
                                            >
                                                {user.is_delete ? "Xóa" : "Hoạt động"}
                                            </TableCell>
                                            <TableCell className="text-red-400 border text-center font-medium text-[11px] ">
                                                {date![1] + " " + date![2] + " " + date![3]}
                                            </TableCell>

                                            {user.user_id === currentId ? (
                                                <TableCell className="text-right text-xs font-semibold border">
                                                    None
                                                </TableCell>
                                            ) : (
                                                <TableCell className="text-right border items-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <GripIcon className="w-5 h-5" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem>
                                                                <p
                                                                    onClick={() => handleOpenEditUserPopup(user)}
                                                                    className="text-xs font-semibold hover:underline hover:cursor-pointer text-blue-gray-600"
                                                                >
                                                                    Chỉnh sửa
                                                                </p>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                {user.is_delete ? (
                                                                    <p
                                                                        onClick={() => handleOpenActiveModal(id)}
                                                                        className="text-xs text-green-700 font-semibold hover:underline hover:cursor-pointer "
                                                                    >
                                                                        Khôi phục
                                                                    </p>
                                                                ) : (
                                                                    <p
                                                                        onClick={() => handleOpenDeleteModal(id)}
                                                                        className="text-xs text-red-700 font-semibold hover:underline hover:cursor-pointer "
                                                                    >
                                                                        Xóa
                                                                    </p>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}

                    {totalPage > 1 && (
                        <div className="flex justify-center my-4 ">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserAdmin;
