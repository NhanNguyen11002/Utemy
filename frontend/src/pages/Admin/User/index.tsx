import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
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
    }, [dispatch, pageIndex, searchItem, role]);
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
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="gray"
                        className="mb-8 p-6 flex justify-center w-full self-center"
                    >
                        <div className="flex items-center justify-center gap-3 text-start w-2/3">
                            <Menu>
                                <MenuHandler>
                                    <button className="bg-black min-w-[80px] text-white hover:text-gray-200 text-sm text-center px-4 py-1 rounded-sm">
                                        {role}
                                    </button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem
                                        id="All"
                                        className="text-black hover:bg-gray-400"
                                        onClick={() => setRole("All")}
                                    >
                                        Tất cả
                                    </MenuItem>
                                    <MenuItem
                                        id="Admin"
                                        className="text-black  hover:bg-gray-400"
                                        onClick={() => setRole("Admin")}
                                    >
                                        Admin
                                    </MenuItem>
                                    <MenuItem
                                        id="User"
                                        className="text-black  hover:bg-gray-400"
                                        onClick={() => setRole("User")}
                                    >
                                        User
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <div className="w-1/2">
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search user..."
                                        className="rounded py-2 px-10 w-full border-[1px] text-gray-700 border-black"
                                        value={userInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setUserInput(e.target.value)
                                        }
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
                                <button
                                    onClick={() => handleReset()}
                                    className="text-sm btn-sm btn btn-outline font-w "
                                >
                                    Làm mới
                                </button>{" "}
                            </div>
                        </div>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 ">
                        <Table className="border">
                            <TableCaption>Danh sách tài khoản</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {["Người dùng", "Loại tài khoản", "Trạng thái", "Ngày tạo", "Hành động"].map(
                                        (header) => (
                                            <TableHead className="">{header}</TableHead>
                                        ),
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => {
                                    const className = ` py-3 px-5 `;
                                    console.log(className);
                                    const date = user.created_at?.toString().split(" ");
                                    const id = user.user_id as number;
                                    return (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                <Link to={`/admin/user-profile/${user.user_id}`}>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar
                                                            src={user.url_avatar || Logo}
                                                            alt={user.user_id?.toString()}
                                                            size="xs"
                                                            variant="rounded"
                                                        />
                                                        <div>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-semibold ${
                                                                    user.user_id === currentId ? "text-lightblue" : ""
                                                                }`}
                                                            >
                                                                {user.first_name} {user.last_name}
                                                            </Typography>
                                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                                {user.email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
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
                                            <TableCell>
                                                <Typography
                                                    color={user.is_delete ? "red" : "blue-gray"}
                                                    className={`py-0.5 px-2 text-[11px] font-medium w-fit ${
                                                        user.is_delete ? "text-red-700" : "text-green-700"
                                                    }`}
                                                >
                                                    {user.is_delete ? "Xóa" : "Hoạt động"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Typography
                                                    color={"blue-gray"}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                >
                                                    {date![1] + " " + date![2] + " " + date![3]}
                                                </Typography>
                                            </TableCell>

                                            {user.user_id === currentId ? (
                                                <TableCell className="text-left">
                                                    <Typography
                                                        as="text"
                                                        className="text-xs font-semibold  text-blue-gray-600"
                                                    >
                                                        None
                                                    </Typography>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="text-left">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <GripIcon className="w-5 h-5" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem>
                                                                <Typography
                                                                    as="text"
                                                                    onClick={() => handleOpenEditUserPopup(user)}
                                                                    className="text-xs font-semibold hover:underline hover:cursor-pointer text-blue-gray-600"
                                                                >
                                                                    Chỉnh sửa
                                                                </Typography>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                {user.is_delete ? (
                                                                    <Typography
                                                                        as="text"
                                                                        onClick={() => handleOpenActiveModal(id)}
                                                                        className="text-xs text-green-700 font-semibold hover:underline hover:cursor-pointer "
                                                                    >
                                                                        Khôi phục
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography
                                                                        as="text"
                                                                        onClick={() => handleOpenDeleteModal(id)}
                                                                        className="text-xs text-red-700 font-semibold hover:underline hover:cursor-pointer "
                                                                    >
                                                                        Xóa
                                                                    </Typography>
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
                        {totalPage > 1 && (
                            <div className="flex justify-center my-4 ">
                                <Pagination
                                    handleChangePageIndex={handleChangePageIndex}
                                    totalPage={totalPage}
                                    currentPage={pageIndex}
                                />
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default UserAdmin;
