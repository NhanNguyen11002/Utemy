import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { UserCircleIcon, ChevronDownIcon, PowerIcon } from "@heroicons/react/24/solid";
import { DefaultAvatar as Logo } from "../../assets/images";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { Toaster } from "react-hot-toast";
// profile menu component
const profileMenuItems = [
    {
        label: "Trang cá nhân",
        link: "/admin/profile",
        icon: UserCircleIcon,
    },
    {
        label: "Đăng xuất",
        icon: PowerIcon,
    },
];

function ProfileMenu() {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.authSlice.user);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const closeMenu = () => setIsMenuOpen(false);
    const logout = () => {
        dispatch(authActions.logout());
        navigate("/");
    };

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger>
                <button color="blue-gray" className="flex items-center gap-2 px-2 rounded-full py-0.5 lg:ml-auto">
                    <p className="text-sm">
                        {user.first_name} {user.last_name}
                    </p>
                    <img
                        alt="avatar"
                        className="border border-gray-400 p-0.5 rounded-full w-8 h-8"
                        src={user.url_avatar ? user.url_avatar : Logo}
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        color="black"
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 gap-2">
                {profileMenuItems.map(({ label, icon, link }, key: number) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <NavLink key={key} to={link as string}>
                            <DropdownMenuItem
                                key={label}
                                onClick={isLastItem ? logout : closeMenu}
                                className={`flex items-center gap-2 rounded cursor-pointer rounded-sm ${
                                    isLastItem
                                        ? " focus:bg-red-500 focus:text-white text-red-500"
                                        : " focus:bg-lightblue/80 focus:text-white text-lightblue/80"
                                }`}
                            >
                                {React.createElement(icon, {
                                    className: `h-4 w-4 `,
                                    strokeWidth: 2,
                                })}
                                <span className="font-normal" color={isLastItem ? "inherit" : "inherit"}>
                                    {label}
                                </span>
                            </DropdownMenuItem>
                        </NavLink>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AdminNavbar() {
    return (
        <div className="mx-auto my-2 max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
            <Toaster />
            <div className="relative mx-auto flex items-center justify-end text-blue-gray-900">
                <ProfileMenu />
            </div>
        </div>
    );
}
