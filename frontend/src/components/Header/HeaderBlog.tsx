import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import UserDropDown from "../Dropdown/UserDropDown";
import { useAppSelector } from "../../hooks/hooks";
interface HeaderBlogProps {
    isLogin: boolean;
}

const HeaderBlog: React.FC<HeaderBlogProps> = ({ isLogin }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const [isDisplayUserDrawer, setIsDisplayUserDrawer] = useState<boolean>(false);

    return (
        <>
            <header className="w-full h-[70px] max-w-full bg-background shadow-xl fixed top-0 left-0 z-[30]">
                <Toaster />
                <div className="w-full h-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <div className="flex-1 flex gap-4 items-center">
                        <Link to={"/"} className="w-[60px] h-[60px] shrink-0">
                            <img src={images.Logo} alt="Logo" />
                        </Link>
                        <div className="bg-gray-400 w-[1px] h-[30px]"></div>
                        <Link to={"/blog"} className="w-[60px] h-[60px] shrink-0 flex items-center">
                            <p className="text-lg hover:text-info  hover:cursor-pointer transition-all duration-300">
                                Blog
                            </p>
                        </Link>
                    </div>
                    {isLogin ? (
                        <>
                            <div className="ml-auto flex shrink-0 items-center">
                                <Link
                                    to={"/"}
                                    className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                                >
                                    Khóa học
                                </Link>

                                {/* DRAWER AVATAR */}
                                <div className="drawer drawer-end">
                                    <input
                                        id="user-drawer"
                                        type="checkbox"
                                        className="drawer-toggle"
                                        checked={isDisplayUserDrawer}
                                        onChange={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                    />
                                    <div className="drawer-content">
                                        <label
                                            data-dropdown-toggle="dropdown"
                                            htmlFor="user-drawer"
                                            className="w-[40px] h-[40px] rounded-full flex items-center justify-center relative border-[1px] hover:cursor-pointer"
                                        >
                                            <img
                                                src={avatar ? avatar : images.DefaultAvatar}
                                                alt="A"
                                                className="w-full h-full object-cover rounded-full"
                                                crossOrigin="anonymous"
                                            />
                                        </label>
                                    </div>
                                    <div className="drawer-side">
                                        <label htmlFor="user-drawer" className="drawer-overlay"></label>
                                        <div
                                            className="menu p-4 w-80 h-full bg-white shadow-sm"
                                            onClick={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                        >
                                            <UserDropDown />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-2 flex justify-end items-center gap-3">
                            <Link to={"/"}>
                                <span className="hidden tablet:block min-w-fit text-sm font-medium hover:text-lightblue transition-all duration-300 cursor-pointer">
                                    Khoá học
                                </span>
                            </Link>
                            <Link to="/login">
                                <button className="text-white btn btn-sm btn-info hover:bg-btn text-sm">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-sm btn-outline text-sm">Đăng ký</button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default HeaderBlog;
