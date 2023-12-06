import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    HomeIcon,
    ServerStackIcon,
    UserCircleIcon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    HeartIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
// import { LogoutIcon } from "../../assets/icons";
import { Button, Typography } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { componentActions, authActions } from "../../redux/slices";

//@ts-ignore
export function Sidebar() {
    const navigate = useNavigate();
    const selected = useAppSelector((state) => state.componentSlice.adminNavPlace) || "dashboard";
    const dispatch = useAppDispatch();
    const openSidenav = true;
    const handleClick = (route: string) => {
        dispatch(componentActions.setAdminNavPlace(route));
    };
    const handleLogout = () => {
        dispatch(authActions.logout());
        navigate("/");
    };
    return (
        <aside
            className={` bg-gradient-to-r from-gray-600 to-gray-700 ${
                openSidenav ? "translate-x-0" : "-translate-x-80"
            } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
        >
            <div className={`relative`}>
                <Link to="/" className="py-6 px-8 text-3xl text-center">
                    <Typography variant="h1" color="white">
                        Utemy
                    </Typography>
                </Link>
            </div>
            <div className="m-4">
                <ul key={"nav-list"} className="mb-4 flex flex-col gap-1">
                    <li key={"admin"}>
                        <Link to="/admin">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "dashboard"
                                        ? "btn-info hover:shadow-lightblue/80"
                                        : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("dashboard")}
                            >
                                <HomeIcon className="w-6 h-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    {"Thống kê"}
                                </Typography>
                            </Button>
                        </Link>
                    </li>
                    <li key={"admin/category"}>
                        <Link to="/admin/category">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "Category" ? "btn-info hover:shadow-lightblue/80" : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("Category")}
                            >
                                <ServerStackIcon className="h-6 w-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    {"Danh mục"}
                                </Typography>
                            </Button>
                        </Link>
                    </li>
                    <li key={"admin/user"}>
                        <NavLink to="/admin/user">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "User" ? "btn-info hover:shadow-lightblue/80" : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("User")}
                            >
                                <UserCircleIcon className="h-6 w-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    {"Người dùng"}
                                </Typography>
                            </Button>
                        </NavLink>
                    </li>
                    <li key={"admin/user/create"}>
                        <NavLink to="/admin/user/create">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "UserCreate"
                                        ? "btn-info hover:shadow-lightblue/80"
                                        : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("UserCreate")}
                            >
                                <PlusCircleIcon className="h-6 w-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    {"Thêm người dùng"}
                                </Typography>
                            </Button>
                        </NavLink>
                    </li>

                    <li key={"admin/feedback"}>
                        <NavLink to="/admin/feedback">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "Feedback" ? "btn-info hover:shadow-lightblue/80" : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("Feedback")}
                            >
                                <ClipboardDocumentListIcon className="h-6 w-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    Phản hồi
                                </Typography>
                            </Button>
                        </NavLink>
                    </li>
                    <li key={"admin/profile"}>
                        <NavLink to="/admin/profile">
                            <Button
                                className={`flex items-center  gap-4 px-4 capitalize ${
                                    selected === "Profile" ? "btn-info hover:shadow-lightblue/80" : "hover:bg-white/10"
                                } `}
                                fullWidth
                                onClick={() => handleClick("Profile")}
                            >
                                <HeartIcon className="h-6 w-6" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    Trang cá nhân
                                </Typography>
                            </Button>
                        </NavLink>
                    </li>
                    <hr className="my-4 border-b-1 border-blueGray-200" />
                    <div>
                        <Button
                            className={`flex items-center  gap-4 px-4 capitalize ${"btn-error hover:shadow-red-400/80"} `}
                            fullWidth
                            onClick={() => handleLogout()}
                        >
                            {/* <LogoutIcon /> */}
                            <XMarkIcon className="h-6 w-6" />
                            <Typography color="white" className="font-medium capitalize">
                                Đăng xuất
                            </Typography>
                        </Button>
                    </div>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
