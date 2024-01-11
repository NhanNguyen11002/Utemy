import React, { useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { testActions } from "../../redux/slices";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";

type TimeCounterProps = {
    handleOpenFinishPopup(): void;
    handleFinish(): void;
};

const TimeCounter: React.FC<TimeCounterProps> = (props) => {
    const dispatch = useAppDispatch();
    const duration = Number(useAppSelector((state) => state.testSlice.duration));
    const is_time_limit = useAppSelector((state) => state.testSlice.test.is_time_limit);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (duration > 0) {
                dispatch(testActions.decrementSeconds());
            } else {
                dispatch(testActions.resetCounterSync());
                if (is_time_limit) {
                    props.handleFinish();
                }
                clearInterval(intervalId);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [dispatch, duration]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
    return (
        <>
            <Menu>
                <MenuHandler>
                    <div
                        className={`flex gap-2 items-center border-2 border-black rounded-md p-2 hover:cursor-pointer ${
                            is_time_limit ? "text-error" : "text-success"
                        } `}
                    >
                        <ClockIcon className="w-5 h-5 shrink-0 " />
                        <span className=" shrink-0">{formatTime(duration)}</span>
                    </div>
                </MenuHandler>
                <MenuList>
                    <MenuItem>
                        <button
                            onClick={props.handleOpenFinishPopup}
                            type="button"
                            className="btn btn-error text-white hover:text-error hover:bg-white hover: border-error border-2 "
                        >
                            Nộp bài
                        </button>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default TimeCounter;
