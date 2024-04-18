import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import UserDropDown from "../Dropdown/UserDropDown";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Course } from "../../types/course";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import constants from "../../constants";

interface HeaderProps {
    course: Course;
    role: string;
}

const WatchVideoHeader: React.FC<HeaderProps> = ({ course, role }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    const overallProgress = useAppSelector((state) => state.progressSlice.overallProgress) || 0;
    const number_of_lecture = useAppSelector((state) => state.courseSlice.courseDetail.number_of_lecture) || 1;
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
                        <Link to={`/${isAdmin ? "admin/" : ""}course-detail/${course.slug}`}>
                            <h2 className="text-white text-xl  hover:opacity-70 ">{course.title}</h2>
                        </Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        {role === constants.util.ROLE_ENROLLED && (
                            <HoverCard>
                                <HoverCardTrigger className="flex items-center w-fit shrink-0 hover:opacity-85 transition-all duration-300 hover:cursor-pointer">
                                    <CircularProgressbar
                                        value={(overallProgress / number_of_lecture) * 100}
                                        text={``}
                                        styles={buildStyles({
                                            pathColor: "#60a5fa",
                                        })}
                                        className="w-10 h-10 fill-blue-400"
                                    />
                                    <p className="text-white text-sm ">Tiến độ của bạn</p>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <div>
                                        Đã hoàn thành {overallProgress}/{number_of_lecture} bài học
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        )}

                        <div className="ml-auto flex shrink-0 items-center">
                            {/* DRAWER AVATAR */}
                            <div className="drawer drawer-end">
                                <input
                                    id="user-drawer"
                                    type="checkbox"
                                    className="drawer-toggle"
                                    checked={isDisplayUserDrawer}
                                    onChange={() => {
                                        if (!isAdmin) setIsDisplayUserDrawer(!isDisplayUserDrawer);
                                    }}
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
                    </div>
                </div>
            </header>
        </>
    );
};

export default WatchVideoHeader;
