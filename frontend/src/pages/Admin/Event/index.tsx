import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import EventCard from "./EventCard";
import PopUpAddEvent from "./PopUpAddEvent";
import PopUpEditEvent from "./PopUpEditEvent";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { eventActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import { DeleteModal } from "../../../components";
import Loading from "../../Loading";
const EventAdmin = () => {
    const [isOpenAddEvent, setIsOpenAddEvent] = useState(false);
    const [isOpenEditEvent, setIsOpenEditEvent] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState("");
    // const [EventCode] = useState("");
    const [eventId, setEventId] = useState(0);
    // const [eventId, setEventId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const events = useAppSelector((state) => state.eventSlice.events);
    const totalPage = useAppSelector((state) => state.eventSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.eventSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.eventSlice.isGetLoading);
    const handleCancelAddEvent = () => {
        setIsOpenAddEvent(!isOpenAddEvent);
    };
    const handleCancelDeleteModel = () => {
        setIsOpenDeleteModel(false);
    };
    const handleOpenDeleteModel = (id: number) => {
        setEventId(id);
        setIsOpenDeleteModel(true);
    };
    const handleOpenPopupEdit = (id: number) => {
        setEventId(id);
        setIsOpenEditEvent(true);
    };
    const handleCancelEditEvent = () => {
        setIsOpenEditEvent(!isOpenEditEvent);
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
        setUserInput("");
    };
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
    };
    const handleDeleteEvent = () => {
        dispatch(eventActions.deleteEvent(eventId)).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(eventActions.getEventsWithPagination({ searchItem: "", pageIndex: 1 }));
                handleCancelDeleteModel();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };

    useEffect(() => {
        console.log("Total page:", totalPage); // Log the current value of 'events' to the console
        console.log("Total record:", totalRecord); // Log the current value of 'events' to the console
        dispatch(eventActions.getEventsWithPagination({ searchItem, pageIndex }));
    }, [dispatch, searchItem, pageIndex]);

    return (
        <>
            {isOpenAddEvent && <PopUpAddEvent handleCancelAddEvent={handleCancelAddEvent} />}
            {isOpenEditEvent && <PopUpEditEvent eventId={eventId} handleCancelEditEvent={handleCancelEditEvent} />}
            {isOpenDeleteModel && (
                <DeleteModal handleCancel={handleCancelDeleteModel} handleDelete={handleDeleteEvent} />
            )}
            {isGetLoading && <Loading />}
            {/* minhscreen */}
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2">
                {/* <Toaster /> */}
                <div className="w-3/4 px-10 mb-5 flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                    <div className="flex justify-between w-full">
                        <div className="w-3/4 mx-auto">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Từ khóa..."
                                    id="search-event"
                                    className="rounded-full py-4 px-10 w-full border-[1px] border-black"
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
                        <button onClick={() => handleReset()} className="text-xl btn btn-outline font-w ">
                            Làm mới
                        </button>{" "}
                    </div>
                    <button
                        onClick={() => setIsOpenAddEvent(!isOpenAddEvent)}
                        className="relative btn-info btn btn-outline  text-xl font-w hover:text-white text-white"
                    >
                        <span className="left-1/2 top-1/2 ">Thêm</span>{" "}
                    </button>{" "}
                </div>
                {events.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">
                        Không tìm thấy sự kiện{" "}
                        {searchItem && (
                            <span>
                                với từ khoá <span className="italic">"{searchItem}"</span>
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">Có {totalRecord} sự kiện được tìm thấy </p>
                )}
                <div className="flex-1  my-1  w-3/4 px-10 justify-start">
                    {events.map((event, index) => {
                        return (
                            <div className="w-full my-1 max-w-xs tablet:max-w-full " key={index}>
                                <EventCard
                                    event={event}
                                    handleOpenPopupEdit={handleOpenPopupEdit}
                                    handleOpenDeleteModel={handleOpenDeleteModel}
                                />
                            </div>
                        );
                    })}
                    {totalPage > 1 && (
                        <div className="flex justify-end my-4">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventAdmin;
