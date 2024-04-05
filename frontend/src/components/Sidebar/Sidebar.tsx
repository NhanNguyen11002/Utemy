import { Link, NavLink } from "react-router-dom";
import {
    ServerStackIcon,
    UserCircleIcon,
    ClipboardDocumentListIcon,
    HeartIcon,
    PlusCircleIcon,
    ChartBarIcon,
    StarIcon,
    LockOpenIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
// import { LogoutIcon } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { componentActions } from "../../redux/slices";
import { useState } from "react";
//@ts-ignore
export function Sidebar() {
    // const navigate = useNavigate();
    const selected = useAppSelector((state) => state.componentSlice.adminNavPlace).toLowerCase() || "dashboard";
    const dispatch = useAppDispatch();
    const handleClick = (route: string) => {
        dispatch(componentActions.setAdminNavPlace(route));
    };
    const [hovered, setHovered] = useState(false);

    // const handleLogout = () => {
    //     dispatch(authActions.logout());
    //     navigate("/");
    // };
    return (
        <div
            className={` bg-[#2C2F31] w-[60px] hover:w-52 fixed inset-0 z-50 h-screen 
             rounded-xl transition-width  duration-500 `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={` `}>
                <Link to="/" className="py-6 px-4 text-center flex flex-row  items-center justify-start gap-3">
                    <StarIcon className="w-6 h-6 shrink-0 text-white" />
                    <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate  `}>Admin</p>
                </Link>
            </div>
            <div className="">
                <ul key={"nav-list"} className="mb-4 flex flex-col gap-1">
                    <li key={"admin"}>
                        <Link to="/admin" className="">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "dashboard" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("dashboard")}
                            >
                                <ChartBarIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Thống kê
                                </p>
                            </button>
                        </Link>
                    </li>
                    <li key={"admin/category"}>
                        <Link to="/admin/category">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "category" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("category")}
                            >
                                <ServerStackIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Danh mục
                                </p>
                            </button>
                        </Link>
                    </li>
                    <li key={"admin/user"}>
                        <NavLink to="/admin/user">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "user" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("user")}
                            >
                                <UserCircleIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Người dùng
                                </p>
                            </button>
                        </NavLink>
                    </li>
                    <li key={"admin/user/create"}>
                        <NavLink to="/admin/user/create">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "usercreate" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("usercreate")}
                            >
                                <PlusCircleIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Thêm người dùng
                                </p>
                            </button>
                        </NavLink>
                    </li>
                    <li key={"admin/approval"}>
                        <NavLink to="/admin/approval">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "approval" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("approval")}
                            >
                                <LockOpenIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Phê duyệt khoá học
                                </p>
                            </button>
                        </NavLink>
                    </li>
                    <li key={"admin/report"}>
                        <NavLink to="/admin/report">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "report" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("report")}
                            >
                                <LockClosedIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Báo cáo khoá học
                                </p>
                            </button>
                        </NavLink>
                    </li>
                    <li key={"admin/feedback"}>
                        <NavLink to="/admin/feedback">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "feedback" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("feedback")}
                            >
                                <ClipboardDocumentListIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Phản hồi
                                </p>
                            </button>
                        </NavLink>
                    </li>
                    <li key={"admin/profile"}>
                        <NavLink to="/admin/profile">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "profile" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("profile")}
                            >
                                <HeartIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Trang cá nhân
                                </p>
                            </button>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
