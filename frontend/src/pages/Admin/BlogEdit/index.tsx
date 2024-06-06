import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { blogActions } from "../../../redux/slices";
import { useParams } from "react-router-dom";
// import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "react-router-dom";
import { ArrowLeftSquareIcon } from "lucide-react";
import NotFound from "../../NotFound";
import { Spin } from "../../../components";
import EditTab from "./EditTab";
import StatusTab from "./StatusTab";
const BlogEdit: React.FC = () => {
    const { slug } = useParams();
    const [tab, setTab] = useState("edit");
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!slug) setIsNotFound(true);
        else {
            dispatch(blogActions.getBlog(slug)).then((response) => {
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
                        <div className="flex gap-5 items-center">
                            <Link
                                to={`/admin/blog`}
                                className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                            >
                                <ArrowLeftSquareIcon className="w-5 h-5" />
                                <p className="text-lg">Danh sách blog</p>
                            </Link>
                        </div>
                        <div className="w-[230px] h-px bg-gray-300 mb-4"></div>
                        <p className="text-2xl font-medium text-blue-400">{blog.title}</p>
                        <Tabs.Root defaultValue="edit" className="h-fit flex w-full">
                            <Tabs.List className="flex flex-col h-fit gap-2 w-[20%] mt-8">
                                <Tabs.Trigger
                                    value="edit"
                                    onClick={() => setTab("edit")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "edit" ? "border-blue-400" : "border-background_2"}`}
                                >
                                    Chỉnh sửa blog
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="status"
                                    onClick={() => setTab("status")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "status" ? "border-blue-400" : "border-background_2"}`}
                                >
                                    Trạng thái blog
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="edit" className="w-[80%]">
                                <EditTab />
                            </Tabs.Content>
                            <Tabs.Content value="status" className="w-[80%]">
                                <StatusTab />
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

export default BlogEdit;
