import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import UserDropDown from "../Dropdown/UserDropDown";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Course } from "../../types/course";
interface HeaderProps {
    course: Course;
    role: string;
}

const WatchVideoHeader: React.FC<HeaderProps> = ({ course, role }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const [isDisplayUserDrawer, setIsDisplayUserDrawer] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <header className="w-full h-[70px] max-w-full bg-[#2D2F31] shadow-xl fixed top-0 left-0 z-[10]">
                <Toaster />
                <div className="w-full h-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <div className="flex-1 flex gap-4 laptop:gap-[120px] items-center">
                        <Link to={"/"} className="w-[60px] h-[60px] shrink-0">
                            <img src={images.WatchVideoLogo} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="h-6 w-px bg-gray-700"></div>
                    </div>
                    <div className="w-full  p-[16px]  rounded-[8px]">
                        <Link to={`/course-detail/${course.slug}`}>
                            <h2 className="text-white text-xl  hover:opacity-70 ">{course.title}</h2>
                        </Link>
                    </div>
                    <>
                        <div className="ml-auto flex shrink-0 items-center">
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
                </div>
            </header>
        </>
    );
};

export default WatchVideoHeader;
