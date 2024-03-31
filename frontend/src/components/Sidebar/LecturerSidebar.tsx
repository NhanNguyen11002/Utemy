import { Link } from "react-router-dom";
import { PlayIcon, ChartBarIcon, PresentationChartBarIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
// import { LogoutIcon } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { componentActions } from "../../redux/slices";
import { useState } from "react";

export function LecturerSidebar() {
    const selected = useAppSelector((state) => state.componentSlice.lecturerNavPlace).toLowerCase() || "courses";
    const dispatch = useAppDispatch();
    const handleClick = (route: string) => {
        dispatch(componentActions.setAdminNavPlace(route));
    };
    // const handleLogout = () => {
    //     dispatch(authActions.logout());
    //     navigate("/");
    // };
    // const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={` bg-[#2C2F31] w-[60px] hover:w-52 fixed inset-0 z-50 h-screen 
             rounded-xl transition-width  duration-500 `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={` `}>
                <Link to="/lecturer" className="py-6 px-4 text-center flex flex-row  items-center justify-start gap-3">
                    <PresentationChartBarIcon className="w-6 h-6 shrink-0 text-white" />
                    <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate  `}>Lecturer</p>
                </Link>
            </div>
            <div className="">
                <ul key={"nav-list"} className="mb-4 flex flex-col gap-1">
                    <li key={"courses"}>
                        <Link to="/lecturer" className="">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "courses" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("courses")}
                            >
                                <PlayIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Khoá học
                                </p>
                            </button>
                        </Link>
                    </li>
                    <li key={"quiz"}>
                        <Link to="/lecturer/quiz" className="">
                            <button
                                className={`flex w-full  items-center  gap-4 h-[50px] pl-3 border-l-4 hover:bg-white/10 ${
                                    selected === "quiz" ? " border-lightblue  " : "border-[#2C2F31]"
                                } `}
                                onClick={() => handleClick("quiz")}
                            >
                                <QuestionMarkCircleIcon className="w-6 h-6 shrink-0 text-white" />
                                <p className={`text-white text-md ${hovered ? "block" : "hidden"} truncate `}>
                                    Bộ câu hỏi
                                </p>
                            </button>
                        </Link>
                    </li>
                    <li key={"dashboard"}>
                        <Link to="/lecturer/dashboard" className="">
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
                </ul>
            </div>
        </div>
    );
}

export default LecturerSidebar;
