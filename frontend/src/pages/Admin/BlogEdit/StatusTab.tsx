import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { DeleteModal } from "../../../components";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { blogActions } from "../../../redux/slices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
type StatusTabProps = {};

const StatusTab: React.FC<StatusTabProps> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const handleDeleteBlog = () => {
        dispatch(blogActions.deleteBlog(blog.slug)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/admin/blog");
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };
    const handleClick = () => {
        const data = {
            slug: blog.slug,
            published: !blog.is_published,
        };
        dispatch(blogActions.togglePublishedBlog(data)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    dispatch(blogActions.setBlogPublished(!blog.is_published));
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    return (
        <div className="w-full border min-h-[600px] shadow-md">
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteBlog} handleCancel={handleCancelModal} />}
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Trạng thái của blog</p>
            </div>
            <div className="p-6 pr-24 border-b border-gray">
                <p>
                    Khi blog đã hoàn thành, bạn có thể thực hiện thay đổi trạng thái của blog (công khai hoặc ẩn) ở đây
                </p>
                <div className="flex gap-1 text-lg my-2">
                    <p className="font-bold">Trạng thái hiện tại: </p>
                    {blog.is_published ? (
                        <span className="font-normal flex gap-1 items-center">
                            Đã xuất bản <CheckBadgeIcon className="w-5 h-5 fill-green-400" strokeWidth={2} />
                        </span>
                    ) : (
                        <span className="font-normal flex gap-1 items-center">
                            Đang ẩn <LockClosedIcon className="w-5 h-5 fill-red-400" strokeWidth={2} />
                        </span>
                    )}
                </div>
                <button
                    onClick={() => handleClick()}
                    disabled={isLoading}
                    type="button"
                    className={`disabled:bg-gray-300 rounded-sm transition-all duration-300 my-2 text-white text-lg ${blog.is_published ? "bg-red-400 hover:bg-red-600 " : "bg-blue-400 hover:bg-blue-600 "} text-white p-4`}
                >
                    {isLoading ? "Loadding" : blog.is_published ? "Ẩn blog" : "Hiển thị blog"}
                </button>
            </div>
            <div className="p-6">
                <p className="text-2xl font-normal">Xoá blog</p>
                <p className="font-normal">
                    Bạn có thể xoá blog tại đây.{" "}
                    <span className="text-red-600">Lưu ý đây là hành động không thể hoàn tác</span>
                </p>
                <button
                    type="button"
                    onClick={() => setIsOpenDeleteModal(true)}
                    className="p-4 py-3 px-4 bg-red-400 hover:bg-red-500 rounded-sm transition-all duration-300 my-2 text-white text-lg"
                >
                    {isLoading || isGetLoading ? "Loading" : "Xoá blog"}{" "}
                </button>
            </div>
        </div>
    );
};

export default StatusTab;
