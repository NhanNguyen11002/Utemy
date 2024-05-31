import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { courseActions } from "../../../redux/slices";
import { useParams } from "react-router-dom";
// import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import * as Tabs from "@radix-ui/react-tabs";

import NotFound from "../../NotFound";
import { Spin } from "../../../components";
import ApprovalTab from "./ApprovalTab";
import DecisionTab from "./DecisonTab";
import ReportTab from "./ReportTab";
const CourseAdmin: React.FC = () => {
    const { slug } = useParams();
    const [tab, setTab] = useState("form");
    const title = useAppSelector((state) => state.courseSlice.courseDetail.title);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!slug) setIsNotFound(true);
        else {
            dispatch(courseActions.getCourseDetail(slug)).then((response) => {
                if (response && response.payload && response.payload.data && response.payload?.status_code === 200) {
                } else {
                    setIsNotFound(true);
                }
            });
        }
    }, [dispatch, slug]);

    // add section

    if (isNotFound) return <NotFound />;

    return (
        <>
            {isGetLoading !== true ? (
                <>
                    <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                        {/* <a
                            href={`/admin/approval`}
                            className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                            <p className="text-lg"> Xét duyệt khoá học</p>
                        </a> */}
                        <p className="text-2xl font-medium text-blue-400">{title}</p>
                        <div className="w-[230px] h-px bg-gray-300 mb-4"></div>
                        <Tabs.Root defaultValue="approval" className="h-fit flex w-full">
                            <Tabs.List className="flex flex-col h-fit gap-2 w-[20%] mt-8">
                                <Tabs.Trigger
                                    value="approval"
                                    onClick={() => setTab("approval")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "approval" ? "border-blue-400" : "border-background_2"}`}
                                >
                                    Duyệt khoá học
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="decision"
                                    onClick={() => setTab("decision")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "decision" ? "border-blue-400" : "border-background_2"}`}
                                >
                                    Quyết định khoá học
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="report"
                                    onClick={() => setTab("report")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "report" ? "border-blue-400" : "border-background_2"}`}
                                >
                                    Báo cáo khoá học
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="approval" className="w-[80%]">
                                <ApprovalTab />
                            </Tabs.Content>
                            <Tabs.Content value="decision" className="w-[80%]">
                                <DecisionTab />
                            </Tabs.Content>
                            <Tabs.Content value="report" className="w-[80%]">
                                <ReportTab />
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </>
            ) : (
                <Spin />
            )}
        </>
    );
};

export default CourseAdmin;
