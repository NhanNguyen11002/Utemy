import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PowerIcon } from "@heroicons/react/24/outline";
import { authActions } from "../../redux/slices";

interface HeaderProps {
    isLogin: boolean;
}

const HeaderLecturer: React.FC<HeaderProps> = ({ isLogin }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleProfileClick = () => {
        navigate("/my-profile");
    };
    const handleStudentClick = () => {
        navigate("/");
    };
    const logout = () => {
        dispatch(authActions.logout());
        navigate("/");
    };
    return (
        <>
            <header className="w-full h-[60px] max-w-full shadow-xl ">
                <Toaster />
                <div className="w-full h-full flex items-end  justify-end py-[10px] px-4 tablet:px-[60px]">
                    <div className="ml-auto flex shrink-0 items-center">
                        <Link
                            to={"/"}
                            className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                        >
                            Học viên
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={avatar || images.DefaultAvatar} />
                                    <AvatarFallback>{images.DefaultAvatar}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleProfileClick()}>Hồ sơ</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStudentClick()}>Học viên</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-error/20" onClick={() => logout()}>
                                    <div className="flex items-center gap-1">
                                        <PowerIcon className="w-4 h-4" />
                                        <p>Đăng xuất</p>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </>
    );
};

export default HeaderLecturer;
