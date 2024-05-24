import React, { useEffect, useState } from "react";
import { images } from "../../assets";
import { Comment } from "@/types/comment";
import { ReplyComment } from "@/types/replycomment";
import ReplyCommentLectureCard from "./ReplyCommentLectureCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { commentActions, reactionActions, replyCommentActions } from "../../redux/slices";
import toast from "react-hot-toast";
import { DeleteModal } from "../../components";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import PopUpAddCommentOrReply from "./PopupAddCommentOrReply";
import { format } from 'date-fns';
// import { Button } from "../../components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card"
import ReactionInfoCard from "./ReactionInfoCard";
import { ScrollArea } from "../../components/ui/scroll-area"
type CommentLectureCardProps = {
    userId: number | undefined;
    comment: Comment;
    editmode: boolean;
    onCommentSave(commentId: number): void
};

const CommentLectureCard: React.FC<CommentLectureCardProps> = (props) => {
    const [showReplies, setShowReplies] = useState(false);
    const isCurrentUserComment = props.userId === props.comment.user.id; // Kiểm tra xem bình luận có phải của người dùng hiện tại không
    const [editMode, setEditMode] = useState(false);
    // const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State để kiểm soát việc hiển thị Popup

    const [editedContent, setEditedContent] = useState(props.comment.content);
    useEffect(() => {
        setEditedContent(props.comment.content);
    }, [props.comment.content, ]);
    useEffect(() => {
        // Cập nhật trạng thái chỉnh sửa khi editMode thay đổi
        setEditMode(props.editmode);
    }, [props.editmode]);

    const user = useAppSelector((state) => state.authSlice.user);

    const dispatch = useAppDispatch();

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    

    const toggleEditMode = (commentId: number) => {
        setEditMode(!editMode);
        setEditingCommentId(commentId);

    };
    const closeAllEditModes = () => {
        setEditingCommentId(null);
    };
    const togglePopup = () => {
        setShowPopup(!showPopup); // Khi nhấn nút "Trả lời", toggle hiển thị Popup
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        dispatch(commentActions.deleteComment({ comment_id: props.comment.comment_id })).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(commentActions.getCommentsWithPaginationByLectureId({lecture_id:props.comment.lecture_id, values: {
                    pageIndex: 1
                }}));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
        setShowDeleteModal(false);
    };
    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };
    const handleCancel = () => {
        setShowDeleteModal(false);
    };
    const handleEdit = () => {
        if (editedContent===""){
            toast.error("Bình luận không được để trống")
        }
        else {
            console.log("content:", editedContent);
            dispatch(commentActions.updateComment({ comment_id: props.comment.comment_id, content: editedContent })).then(
                (response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        toast.success(response.payload.message);
                        dispatch(commentActions.getCommentsWithPaginationByLectureId({lecture_id:props.comment.lecture_id, values: {
                            pageIndex: 1
                        }}));
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                },
            );
            toggleEditMode(props.comment.comment_id);
            props.onCommentSave(props.comment.comment_id);
            closeAllEditModes(); // Đóng tất cả các trạng thái chỉnh sửa
        }
        
    };

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(props.comment.likes_count);
    const [dislikesCount, setDislikesCount] = useState(props.comment.dislikes_count);
    useEffect(() => {
        if (props.comment.likes.some(like => like.user.user_id === user.user_id && like.comment_id === props.comment.comment_id && like.reply_id === null)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [props.comment.likes, user.user_id, props.comment.comment_id, props.comment.replyCommentLectures.reply_id ]);
    
    // Kiểm tra nếu người dùng đã không thích bình luận
    useEffect(() => {
        if (props.comment.dislikes.some(dislike => dislike.user.user_id === user.user_id && dislike.comment_id === props.comment.comment_id && dislike.reply_id === null)) {
            setDisliked(true);
        } else {
            setDisliked(false);
        }
    }, [props.comment.dislikes, user.user_id, props.comment.comment_id, props.comment.replyCommentLectures.reply_id]);
    const [likeRequested, setLikeRequested] = useState(false);
    const [dislikeRequested, setDislikeRequested] = useState(false);

    const handleLike = () => {
        // Kiểm tra xem yêu cầu thích đang được gửi đi hay không
        if (!likeRequested) {
            if (!liked) {
                // Nếu người dùng chưa thích bình luận và chưa gửi yêu cầu thích
                setLikeRequested(true); // Đặt trạng thái yêu cầu đã gửi
                dispatch(reactionActions.createLike({ 
                    comment_id: props.comment.comment_id, 
                    reply_id: null 
                })).then((response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        // toast.success(response.payload.message);
                        // Cập nhật số lượt thích và trạng thái nút thích
                        setLikesCount(likesCount + 1);
                        setLiked(true);
                        // Lấy lại danh sách bình luận sau khi thích thành công
                        dispatch(commentActions.getCommentsWithPaginationByLectureId({
                            lecture_id: props.comment.lecture_id, 
                            values: {
                                pageIndex: 1
                            }
                        }));
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                    // Đặt lại trạng thái yêu cầu sau khi xử lý xong
                    setLikeRequested(false);
                });
            } else {
                // Gửi yêu cầu xóa thích bình luận
                setLikeRequested(true); // Đặt trạng thái yêu cầu đã gửi
                dispatch(reactionActions.deleteLike({ 
                    comment_id: props.comment.comment_id, 
                    reply_id: null 
                })).then((response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        // toast.success(response.payload.message);
                        // Cập nhật số lượt thích và trạng thái nút thích
                        setLikesCount(likesCount - 1);
                        setLiked(false);
                        // Lấy lại danh sách bình luận sau khi hủy thích thành công
                        dispatch(commentActions.getCommentsWithPaginationByLectureId({
                            lecture_id: props.comment.lecture_id, 
                            values: {
                                pageIndex: 1
                            }
                        }));
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                    // Đặt lại trạng thái yêu cầu sau khi xử lý xong
                    setLikeRequested(false);
                });
            }
        }
    };

    const handleDislike = () => {
        // Kiểm tra xem yêu cầu Dislike đang được gửi đi hay không
        if (!dislikeRequested) {
            if (!disliked) {
                // Nếu người dùng chưa Dislike bình luận và chưa gửi yêu cầu Dislike
                setDislikeRequested(true); // Đặt trạng thái yêu cầu đã gửi
                dispatch(reactionActions.createDislike({ 
                    comment_id: props.comment.comment_id, 
                    reply_id: null 
                })).then((response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        // toast.success(response.payload.message);
                        // Cập nhật số lượt Dislike và trạng thái nút Dislike
                        setDislikesCount(dislikesCount + 1);
                        setDisliked(true);
                        // Lấy lại danh sách bình luận sau khi Dislike thành công
                        dispatch(commentActions.getCommentsWithPaginationByLectureId({
                            lecture_id: props.comment.lecture_id, 
                            values: {
                                pageIndex: 1
                            }
                        }));
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                    // Đặt lại trạng thái yêu cầu sau khi xử lý xong
                    setDislikeRequested(false);
                });
            } else {
                // Gửi yêu cầu xóa Dislike bình luận
                setDislikeRequested(true); // Đặt trạng thái yêu cầu đã gửi
                dispatch(reactionActions.deleteDislike({ 
                    comment_id: props.comment.comment_id, 
                    reply_id: null 
                })).then((response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        // toast.success(response.payload.message);
                        // Cập nhật số lượt Dislike và trạng thái nút Dislike
                        setDislikesCount(dislikesCount - 1);
                        setDisliked(false);
                        // Lấy lại danh sách bình luận sau khi hủy Dislike thành công
                        dispatch(commentActions.getCommentsWithPaginationByLectureId({
                            lecture_id: props.comment.lecture_id, 
                            values: {
                                pageIndex: 1
                            }
                        }));
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                    // Đặt lại trạng thái yêu cầu sau khi xử lý xong
                    setDislikeRequested(false);
                });
            }
        }
    };
    
    // const reactions = [
    //     ...props.comment.likes.map((like) => ({ id: like.like_id, ...like })),
    //     ...props.comment.dislikes.map((dislike) => ({ id: dislike.dislike_id, ...dislike })),
    // ];

    return (
        <div  className ={"mr-8"}>
            <div className={`flex items-start justify-between w-full h-full rounded-lg my-0`}>
                <div className="avatar mr-1 hover:cursor-pointer">
                    <div className={`items-center justify-between w-14 border "border-lightblue"`}>
                        <img alt="Avatar" src={(props.comment.user.url_avatar as string) || images.DefaultAvatar} />
                    </div>
                </div>
                <div className={`w-full py-2 px-6 h-full bg-cyan-200/50 rounded-lg my-1`}>
                    <div className="flex justify-between">
                        <p className={`comment-author mb-1 italic font-bold`}>
                            {props.comment.user.first_name} {props.comment.user.last_name}
                        </p>
                        <p className="comment-date mb-1 text-black italic">{format(new Date(props.comment.updatedAt), "HH:mm dd/MM/yyyy")}</p>
                    </div>
                    {editMode  && editingCommentId === props.comment.comment_id ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full py-2 px-6 h-full bg-white rounded-lg my-1 edit-textarea"
                            style={{ height: '200px' }}

                        />
                    ) : (
                        <div className="flex justify-between">
                            <p className="comment w-full flex text-black flex-wrap line-height:1.5 max-height:1.5 ">
                                {props.comment.content}
                            </p>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                        {editMode && editingCommentId === props.comment.comment_id ? (
                            <>
                                <button
                                    className="save-button text-green-500 hover:text-green-700 "
                                    onClick={handleEdit}
                                >
                                    Lưu
                                </button>
                                <button
                                    className="cancel-button text-red-500 hover:text-red-700"
                                    onClick={() =>toggleEditMode(props.comment.comment_id)}
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

                                    {isCurrentUserComment && (
                                        <div className="flex items-center ml-2">
                                            <button
                                                className="edit-button text-blue-500 hover:text-blue-700 mr-2 focus:outline-none"
                                                onClick={()=>toggleEditMode(props.comment.comment_id)}
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
                                    <span className="mr-2">{props.comment.likes_count}</span>
                                    <button
                                        className={`like-button focus:outline-none ${
                                            liked ? "text-bold text-blue-600" : ""
                                        }`}
                                        onClick={handleLike}
                                    >
                                        <HandThumbUpIcon className="w-6 h-6 shrink-0" />
                                    </button>
                                    <span className="ml-2 mr-2">{props.comment.dislikes_count}</span>
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
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <span className="mr-2">{props.comment.likes_count}</span>
                                        </HoverCardTrigger>

                                        <HoverCardContent className="w-80">
                                        <ScrollArea className="h-72 w-70 rounded-md border">

                                        {props.comment.likes
                                            .filter(like => like.reply_id === null) // Lọc các likes có reply_id bằng null
                                            .map(like => (
                                            <ReactionInfoCard key={like.like_id} reaction={{ id: like.like_id, ...like }} handleClick={handleCancel} />
                                        ))}
                                        </ScrollArea>

                                        </HoverCardContent>
                                    </HoverCard>
                                    <button
                                        className={`like-button focus:outline-none ${liked ? "text-bold text-blue-600" : ""}`}
                                        onClick={handleLike}
                                    >
                                        <HandThumbUpIcon className="w-6 h-6 shrink-0" />
                                    </button>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <span className="ml-2 mr-2">{props.comment.dislikes_count}</span>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                        <ScrollArea className="h-72 w-70 rounded-md border">

                                        {props.comment.dislikes
                                            .filter(dislike => dislike.reply_id === null) // Lọc các dislikes có reply_id bằng null
                                            .map(dislike => (
                                            <ReactionInfoCard key={dislike.dislike_id} reaction={{ id: dislike.dislike_id, ...dislike }} handleClick={handleCancel} />
                                        ))}
                                        </ScrollArea>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <button
                                        className={`dislike-button focus:outline-none ${disliked ? "text-bold text-red-700" : ""}`}
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
                                dispatch(
                                    replyCommentActions.createReplyComment({
                                        content: content,
                                        comment_id: props.comment.comment_id,
                                    }),
                                ).then((response) => {
                                    if (response.payload && response.payload.status_code === 200) {
                                        // Phản hồi thành công từ createComment, dispatch action mới ở đây
                                        dispatch(commentActions.getCommentsWithPaginationByLectureId({lecture_id:props.comment.lecture_id, values: {
                                            pageIndex: 1
                                        }}));
                                    }
                                });
                            }}
                            onCancel={togglePopup} // Đóng Popup khi nhấn Hủy
                        />
                    )}
                    {showDeleteModal && <DeleteModal handleDelete={handleDelete} handleCancel={handleCancel} />}
                    {Array.isArray(props.comment.replyCommentLectures) &&
                        props.comment.replyCommentLectures.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentLectureCard;
