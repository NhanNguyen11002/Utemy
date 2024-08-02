import React, { useEffect, useState } from "react";
import { images } from "../../assets";
import { ReplyComment } from "@/types/replycomment";
import { DeleteModal } from "../../components";
import { boxChatActions, commentActions, reactionActions, replyCommentActions } from "../../redux/slices";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import toast from "react-hot-toast";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import PopUpAddCommentOrReply from "./PopupAddCommentOrReply";
import { format } from "date-fns";
import { Like } from "@/types/like";
import { Dislike } from "@/types/dislike";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import ReactionInfoCard from "./ReactionInfoCard";
import { ScrollArea } from "../../components/ui/scroll-area";

type ReplyCommentLectureCardProps = {
    userId: number | undefined;
    replycomment: ReplyComment;
    commentId: number;
    courseId: number;
    lectureId: number;
    likes: Like[];
    dislikes: Dislike[];
};

const ReplyCommentLectureCard: React.FC<ReplyCommentLectureCardProps> = (props) => {
    const isCurrentUserReply = props.replycomment.user.user_id === props.userId; // Kiểm tra xem bình luận có phải của người dùng hiện tại không
    const [editedContent, setEditedContent] = useState(props.replycomment.content);

    const handleEdit = () => {
        if (editedContent === "") {
            toast.error("Bình luận không được để trống");
        } else {
            // Xử lý khi nhấn vào nút "Sửa"
            dispatch(boxChatActions.checkValidateComment({ content: editedContent })).then((response) => {
                if (response.payload && response.payload.data.isValid === true) {
                    dispatch(
                        replyCommentActions.updateReplyComment({
                            reply_id: props.replycomment.reply_id,
                            content: editedContent,
                        }),
                    ).then((response) => {
                        if (response.payload && response.payload.status_code === 200) {
                            toast.success(response.payload.message);
                            dispatch(
                                commentActions.getCommentsWithPaginationByCourseId({
                                    course_id: props.courseId,
                                    values: {
                                        pageIndex: 1,
                                    },
                                }),
                            );
                        } else {
                            if (response.payload) toast.error(response.payload.message);
                        }
                    });
                    toggleEditMode();
                } else {
                    if (response.payload && response.payload.message) toast.error(response.payload?.message);
                }
            });
        }
    };
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(props.replycomment.likes_count);
    const [dislikesCount, setDislikesCount] = useState(props.replycomment.dislikes_count);
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };
    useEffect(() => {
        if (
            props.likes.some(
                (like) =>
                    like.user.user_id === props.userId &&
                    like.comment_id === props.commentId &&
                    like.reply_id === props.replycomment.reply_id,
            )
        ) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [props.likes, props.userId, props.commentId, props.replycomment.reply_id]);

    // Kiểm tra nếu người dùng đã không thích bình luận
    useEffect(() => {
        if (
            props.dislikes.some(
                (dislike) =>
                    dislike.user.user_id === props.userId &&
                    dislike.comment_id === props.commentId &&
                    dislike.reply_id === props.replycomment.reply_id,
            )
        ) {
            setDisliked(true);
        } else {
            setDisliked(false);
        }
    }, [props.dislikes, props.userId, props.commentId, props.replycomment.reply_id]);

    const handleLike = () => {
        if (!liked) {
            setLikesCount(likesCount + 1);

            // Nếu chưa like thì thay đổi trạng thái của nút like và gửi action
            setLiked(true);
            setDisliked(false); // Đồng thời đặt trạng thái dislike về false
            // Dispatch action tương ứng với việc like
            dispatch(
                reactionActions.createLike({ reply_id: props.replycomment.reply_id, comment_id: props.commentId }),
            ).then((response) => {
                if (response.payload && response.payload.status_code === 200) {
                    // toast.success(response.payload.message);
                    dispatch(
                        commentActions.getCommentsWithPaginationByCourseId({
                            course_id: props.courseId,
                            values: {
                                pageIndex: 1,
                            },
                        }),
                    );
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        } else {
            setLikesCount(likesCount - 1);

            // Nếu đã like và nhấn lại, thì đặt lại trạng thái của nút like
            setLiked(false);
            // Dispatch action tương ứng để bỏ like
            dispatch(
                reactionActions.deleteLike({ reply_id: props.replycomment.reply_id, comment_id: props.commentId }),
            ).then((response) => {
                if (response.payload && response.payload.status_code === 200) {
                    // toast.success(response.payload.message);
                    dispatch(
                        commentActions.getCommentsWithPaginationByCourseId({
                            course_id: props.courseId,
                            values: {
                                pageIndex: 1,
                            },
                        }),
                    );
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDislikesCount(dislikesCount + 1);

            // Tương tự như handleLike
            setDisliked(true);
            setLiked(false); // Đặt trạng thái like về false
            // Dispatch action tương ứng với việc dislike
            dispatch(
                reactionActions.createDislike({ reply_id: props.replycomment.reply_id, comment_id: props.commentId }),
            ).then((response) => {
                if (response.payload && response.payload.status_code === 200) {
                    // toast.success(response.payload.message);
                    dispatch(
                        commentActions.getCommentsWithPaginationByCourseId({
                            course_id: props.courseId,
                            values: {
                                pageIndex: 1,
                            },
                        }),
                    );
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        } else {
            setDislikesCount(dislikesCount - 1);

            setDisliked(false);
            // Dispatch action để bỏ dislike
            dispatch(
                reactionActions.deleteDislike({ reply_id: props.replycomment.reply_id, comment_id: props.commentId }),
            ).then((response) => {
                if (response.payload && response.payload.status_code === 200) {
                    // toast.success(response.payload.message);
                    dispatch(
                        commentActions.getCommentsWithPaginationByCourseId({
                            course_id: props.courseId,
                            values: {
                                pageIndex: 1,
                            },
                        }),
                    );
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        }
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        dispatch(replyCommentActions.deleteReplyComment({ reply_id: props.replycomment.reply_id })).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);

                dispatch(
                    commentActions.getCommentsWithPaginationByCourseId({
                        course_id: props.courseId,
                        values: {
                            pageIndex: 1,
                        },
                    }),
                );
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
        setShowDeleteModal(false);
    };
    const handleCancel = () => {
        setShowDeleteModal(false);
    };
    const [showPopup, setShowPopup] = useState(false); // State để kiểm soát việc hiển thị Popup
    const togglePopup = () => {
        setShowPopup(!showPopup); // Khi nhấn nút "Trả lời", toggle hiển thị Popup
    };
    const isSavingPopUpAdd = useAppSelector((state) => state.boxchatSlice.isGetLoading); // Thêm state để theo dõi trạng thái đang lưu

    return (
        <div>
            <div className={`flex items-start justify-between w-full h-full rounded-lg my-0`}>
                <div className="avatar mr-1 hover:cursor-pointer">
                    <div className={`items-center justify-between w-14 border "border-lightblue"`}>
                        <img
                            alt={`${props.replycomment.user.first_name} ${props.replycomment.user.last_name}`}
                            src={(props.replycomment.user.url_avatar as string) || images.DefaultAvatar}
                        />
                    </div>
                </div>
                <div className={`w-full py-2 px-6 h-full bg-cyan-200 rounded-lg my-1`}>
                    <div className="flex justify-between">
                        <p className={`comment-author mb-1 italic font-bold`}>
                            {props.replycomment.user.first_name} {props.replycomment.user.last_name}
                        </p>
                        <p className="comment-date mb-1 text-black italic">
                            {format(new Date(props.replycomment.updatedAt), "HH:mm dd/MM/yyyy")}
                        </p>
                    </div>
                    {editMode ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full py-2 px-6 h-full bg-gray-50 rounded-lg my-1 edit-textarea"
                            style={{ height: "200px" }}
                        />
                    ) : (
                        <div className="flex justify-between">
                            <p className="comment w-full flex text-black flex-wrap line-height:1.5 max-height:1.5 ">
                                {props.replycomment.content}
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end items-center mt-2">
                        {editMode ? (
                            <>
                                <button
                                    type="submit"
                                    className="text-white btn btn-info text-lg"
                                    onClick={handleEdit}
                                    disabled={isSavingPopUpAdd}
                                >
                                    {isSavingPopUpAdd ? <span className="loading loading-spinner"></span> : ""}
                                    {isSavingPopUpAdd ? "Loading..." : "Lưu"}
                                </button>
                                <button
                                    type="button"
                                    className="btn text-lg ml-2"
                                    onClick={toggleEditMode}
                                    disabled={isSavingPopUpAdd}
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <button
                                        className="reply-button text-blue-500 hover:text-blue-700 focus:outline-none"
                                        onClick={togglePopup}
                                    >
                                        Trả lời
                                    </button>

                                    {isCurrentUserReply && (
                                        <div className="flex items-center ml-2">
                                            <button
                                                className="edit-button text-blue-500 hover:text-blue-700 mr-2 focus:outline-none"
                                                onClick={toggleEditMode}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="delete-button text-red-500 hover:text-red-700 focus:outline-none"
                                                onClick={toggleDeleteModal}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* <div className="flex items-center ml-auto">
                                    <span className="mr-2">{props.replycomment.likes_count}</span>
                                    <button
                                        className={`like-button focus:outline-none ${
                                            liked ? "text-bold text-blue-600" : ""
                                        }`}
                                        onClick={handleLike}
                                    >
                                        <HandThumbUpIcon className="w-6 h-6 shrink-0" />
                                    </button>
                                    <span className="ml-2 mr-2">{props.replycomment.dislikes_count}</span>
                                    <button
                                        className={`dislike-button focus:outline-none ${
                                            disliked ? "text-bold text-red-700" : ""
                                        }`}
                                        onClick={handleDislike}
                                    >
                                        <HandThumbDownIcon className="w-6 h-6 shrink-0" />
                                    </button>
                                </div> */}
                                <div className="flex items-center ml-auto">
                                    {/* HoverCard for Likes */}
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <span className="mr-2">{props.replycomment.likes_count}</span>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <ScrollArea className="h-72 w-70 rounded-md border">
                                                {props.likes
                                                    .filter((like) => like.reply_id === props.replycomment.reply_id)
                                                    .map((like) => (
                                                        <ReactionInfoCard
                                                            key={like.like_id}
                                                            reaction={{ id: like.like_id, ...like }}
                                                            handleClick={handleCancel}
                                                        />
                                                    ))}
                                            </ScrollArea>
                                        </HoverCardContent>
                                    </HoverCard>

                                    {/* Like button */}
                                    <button
                                        className={`like-button focus:outline-none ${
                                            liked ? "text-bold text-blue-600" : ""
                                        }`}
                                        onClick={handleLike}
                                    >
                                        <HandThumbUpIcon className="w-6 h-6 shrink-0" />
                                    </button>

                                    {/* HoverCard for Dislikes */}
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <span className="ml-2 mr-2">{props.replycomment.dislikes_count}</span>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <ScrollArea className="h-72 w-70 rounded-md border">
                                                {props.dislikes
                                                    .filter(
                                                        (dislike) => dislike.reply_id === props.replycomment.reply_id,
                                                    )
                                                    .map((dislike) => (
                                                        <ReactionInfoCard
                                                            key={dislike.dislike_id}
                                                            reaction={{ id: dislike.dislike_id, ...dislike }}
                                                            handleClick={handleCancel}
                                                        />
                                                    ))}
                                            </ScrollArea>
                                        </HoverCardContent>
                                    </HoverCard>

                                    {/* Dislike button */}
                                    <button
                                        className={`dislike-button focus:outline-none ${
                                            disliked ? "text-bold text-red-700" : ""
                                        }`}
                                        onClick={handleDislike}
                                    >
                                        <HandThumbDownIcon className="w-6 h-6 shrink-0" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Hiển thị PopupAddCommentOrReply nếu showPopup === true */}
                    {showPopup && (
                        <PopUpAddCommentOrReply
                            onSave={(content) => {
                                dispatch(boxChatActions.checkValidateComment({ content: content })).then((response) => {
                                    if (response.payload && response.payload.data.isValid === true) {
                                        dispatch(
                                            replyCommentActions.createReplyComment({
                                                content: content,
                                                comment_id: props.commentId,
                                            }),
                                        ).then((response) => {
                                            if (response.payload && response.payload.status_code === 200) {
                                                // Phản hồi thành công từ createComment, dispatch action mới ở đây
                                                dispatch(
                                                    commentActions.getCommentsWithPaginationByCourseId({
                                                        course_id: props.courseId,
                                                        values: {
                                                            pageIndex: 1,
                                                        },
                                                    }),
                                                );
                                                setShowPopup(!showPopup);
                                            }
                                        });
                                    } else {
                                        if (response.payload && response.payload.message)
                                            toast.error(response.payload?.message);
                                    }
                                });
                            }}
                            isSaving={isSavingPopUpAdd} // Đóng Popup khi nhấn Hủy
                            onCancel={togglePopup} // Đóng Popup khi nhấn Hủy
                            addMode={showPopup}
                        />
                    )}
                    {showDeleteModal && <DeleteModal handleDelete={handleDelete} handleCancel={handleCancel} />}
                    {/* {Array.isArray(props.replycomment.replyCommentLectures) &&
                        props.replyCommentLectures.length > 0 && (
                            <button
                                className="reply-button text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
                                onClick={toggleReplies}
                            >
                                {showReplies ? "Ẩn bình luận trước đó" : "Xem bình luận trước đó"}
                            </button>
                        )}
                    {showReplies && Array.isArray(props.comment.replyCommentLectures) && (
                        <div>
                            {props.comment.replyCommentLectures.map((replyComment: ReplyComment, index: number) => (
                                <ReplyCommentLectureCard
                                    key={index}
                                    replycomment={replyComment}
                                    commentId ={props.comment.comment_id}
                                    userId={user.user_id || undefined}
                                    lectureId={props.comment.lecture_id}
                                    likes = {props.comment.likes}
                                    dislikes = {props.comment.dislikes}
                                />
                            ))}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default ReplyCommentLectureCard;
