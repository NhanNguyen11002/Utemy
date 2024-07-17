import React, {  useEffect } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import * as Tabs from "@radix-ui/react-tabs";
import DashboardTab from "./DashboardTab";
import CourseTab from "./RankCourseTab";
import LecturerTab from "./RankLecturerTab";
import { componentActions } from "../../../redux/slices";

export function Home() {
    // const [tab, setTab] = useState("dashboard");
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(componentActions.setAdminNavPlace("dashboard"));
    }, [dispatch]);
    return (
        <div className="pt-[15px] bg-background_2">
            <Tabs.Root defaultValue="dashboard" className="h-fit flex w-full">
                <Tabs.List className="flex flex-col h-fit gap-2 w-[15%]">
                    <Tabs.Trigger
                        value="dashboard"
                        // onClick={() => setTab("dashboard")}
                        className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 data-[state=active]:border-blue-400 data-[state=inactive]:border-background_2`}
                    >
                        Thống kê chính
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="lecturer"
                        // onClick={() => setTab("lecturer")}
                        className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 data-[state=active]:border-blue-400 data-[state=inactive]:border-background_2`}
                    >
                        Xếp hạng giảng viên
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="course"
                        // onClick={() => setTab("course")}
                        className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 data-[state=active]:border-blue-400 data-[state=inactive]:border-background_2`}
                    >
                        Xếp hạng khoá học
                    </Tabs.Trigger>
                </Tabs.List>
                <div className="w-[0.5px] h-[150px] bg-gray-300 mx-2"></div>
                <Tabs.Content value="dashboard" className="w-[85%]">
                    <DashboardTab />
                </Tabs.Content>
                <Tabs.Content value="lecturer" className="w-[85%]">
                    <LecturerTab />
                </Tabs.Content>
                <Tabs.Content value="course" className="w-[85%]">
                    <CourseTab />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

export default Home;
