import React, { useState, useEffect, useRef } from "react";
import QuizGroupCard from "./QuizGroupCard";
import QuizCard from "./QuizCard";
import { QuizGroupType, QuizType } from "../../types/quiz";
import QuizEditPopup from "./QuizEditPopup";
import QuizAddPopup from "./QuizAddPopup";
import DeleteGroupModal from "./DeleteGroupModal";
import DeleteQuizModal from "./DeleteQuizModal";
import QuizGroupAddPopup from "./QuizGroupAddPopup";
import QuizGroupEditPopup from "./QuizGroupEditPopup";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { quizActions, componentActions } from "../../redux/slices";
import { SearchIcon } from "../../assets/icons";

const QuizHome: React.FC = () => {
    const dispatch = useAppDispatch();
    const [openEditPopup, setOpenEditPopup] = useState(false);
    const [openAddPopup, setOpenAddPopup] = useState(false);
    const [openEditGroupPopup, setOpenEditGroupPopup] = useState(false);
    const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
    const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);
    const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const [searchItem, setSearchItem] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [groupId, setGroupId] = useState(0);
    const [groupName, setGroupName] = useState("");
    const quizGroupList = useAppSelector((state) => state.quizSlice.quizGroupList);
    const quizList = useAppSelector((state) => state.quizSlice.quizList);
    const [editQuiz, setEditQuiz] = useState<QuizType>(quizList[0]);
    const [editGroup, setEditGroup] = useState<QuizGroupType>(quizGroupList[0]);

    useEffect(() => {
        dispatch(componentActions.setLecturerNavPlace("quiz"));
        dispatch(quizActions.getAllQuizGroup()).then((response) => {
            if (response.payload?.status_code === 200) {
                if (quizGroupList.length > 0) setGroupId(quizGroupList[0].quiz_group_id);
            }
        });
    }, [dispatch]);
    useEffect(() => {
        if (groupId === 0) return;

        const data = {
            quiz_group_id: groupId,
            searchItem: searchItem,
        };
        dispatch(quizActions.getAllQuizByGroupId(data));
    }, [groupId, dispatch, searchItem]);

    //edit quiz
    const handleOpenEditQuiz = (quiz: QuizType) => {
        setEditQuiz(quiz);
        setOpenEditPopup(true);
    };
    const handleCancelEdit = () => {
        setOpenEditPopup(false);
    };
    //edit group
    const handleOpenEditGroup = (group: QuizGroupType) => {
        setEditGroup(group);
        setOpenEditGroupPopup(true);
    };
    const handleCancelEditGroup = () => {
        setOpenEditGroupPopup(!openEditGroupPopup);
    };

    //delete quiz
    const handleOpenDeleteQuiz = (quiz: QuizType) => {
        setEditQuiz(quiz);
        setOpenDeleteQuizModal(true);
    };
    const handleToggleDeleteQuiz = () => {
        setOpenDeleteQuizModal(!openDeleteQuizModal);
    };
    //delete group
    const handleOpenDeleteGroup = (group: QuizGroupType) => {
        setEditGroup(group);
        setOpenDeleteGroupModal(true);
    };
    const handleToggleDeleteGroup = () => {
        setOpenDeleteGroupModal(!openDeleteGroupModal);
    };
    //add quiz
    const handleToggleAdd = () => {
        setOpenAddPopup(!openAddPopup);
    };
    //add group
    const handleToggleAddGroup = () => {
        setOpenAddGroupPopup(!openAddGroupPopup);
    };
    //
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
    };
    //
    const handleReset = () => {
        setSearchItem("");
    };
    return (
        <>
            {/* {isLoading && <Spin />} */}
            {openEditPopup && <QuizEditPopup quiz={editQuiz} handleCancelEdit={handleCancelEdit} />}
            {openAddPopup && <QuizAddPopup groupId={groupId} handleCancelAdd={handleToggleAdd} />}
            {openDeleteQuizModal && <DeleteQuizModal quiz={editQuiz} handleCancel={handleToggleDeleteQuiz} />}
            {openDeleteGroupModal && <DeleteGroupModal group={editGroup} handleCancel={handleToggleDeleteGroup} />}
            {openEditGroupPopup && <QuizGroupEditPopup group={editGroup} handleCancelEdit={handleCancelEditGroup} />}
            {openAddGroupPopup && <QuizGroupAddPopup handleCancelAdd={handleToggleAddGroup} />}
            <div className=" w-full h-[100vh] mx-auto mt-[10px]  justify-center flex  ">
                <div className=" w-[30%] bg-white  shadow-lg pt-[20px]">
                    <div className="h-[10%] flex items-center justify-between text-black border-b mx-3">
                        <div>
                            <h1 className="text-2xl text-black font-bold ">Bộ câu hỏi</h1>
                            <h1 className="text-lg text-black ">Chọn để hiển thị các câu hỏi bên phải</h1>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleAddGroup}
                            className="py-2 px-4 hover:cursor-pointer text-white bg-blue-500 hover:bg-white hover:text-blue-500 border hover:border-blue-400 transition-all rounded-md"
                        >
                            Thêm
                        </button>
                    </div>
                    <div className="h-[90%] overflow-auto w-[98%] justify-center grid-rows-1">
                        {quizGroupList.length > 0 &&
                            quizGroupList.map((group, index) => {
                                return (
                                    <QuizGroupCard
                                        handleOpenGroup={() => {
                                            setGroupId(group.quiz_group_id);
                                            setGroupName(group.title);
                                        }}
                                        key={index}
                                        group={group}
                                        handleOpenDelete={handleOpenDeleteGroup}
                                        handleOpenEdit={handleOpenEditGroup}
                                    />
                                );
                            })}
                    </div>
                </div>
                <div className="w-1/2 h-full bg-footer shadow-lg pt-[20px]">
                    <div className="h-[10%] flex  items-center justify-between mx-3 pl-5 text-black border-b">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Điền từ khóa ở đây..."
                                    className="rounded-full py-4 px-10 w-full tablet:w-[70%] border-[1px] border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleKeyWordSearch();
                                    }}
                                />
                                <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <div className="gap-2 flex">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn border-1 border-gray-600 text-black "
                            >
                                Làm mới
                            </button>
                            <button
                                type="button"
                                onClick={handleToggleAdd}
                                className="py-2 px-4 hover:cursor-pointer text-white bg-blue-500 hover:bg-white hover:text-blue-500 border hover:border-blue-400 transition-all rounded-md"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                    <div className="h-[90%] flex flex-col  overflow-auto">
                        {groupId === 0 && (
                            <div className="text-center">
                                <p>Vui lòng chọn bộ câu hỏi bên trái để hiển thị câu hỏi</p>
                            </div>
                        )}
                        {groupId !== 0 && quizList.length > 0 ? (
                            quizList.map((data, index) => {
                                return (
                                    <div key={index}>
                                        <QuizCard
                                            key={index}
                                            quiz={data}
                                            handleOpenEdit={handleOpenEditQuiz}
                                            handleOpenDelete={handleOpenDeleteQuiz}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center">
                                <p>Có vẻ {groupName} chưa có câu hỏi nào, tạo mới ngay bây giờ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizHome;
