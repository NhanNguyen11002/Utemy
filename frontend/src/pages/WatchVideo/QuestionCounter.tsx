import React from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { testActions } from "../../redux/slices";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

type QuestionCounterProps = {
    questionCount: number;
    questionIndex: number;
};

const QuestionCounter: React.FC<QuestionCounterProps> = (props) => {
    const dispatch = useAppDispatch();
    const handleChoseQuestion = (index: number) => {
        dispatch(testActions.setNowQuestion(index));
    };
    const loopArray = Array.from({ length: props.questionCount });
    return (
        <>
            <Menu placement="left-start">
                <MenuHandler>
                    <div className="flex gap-2 items-center border-2 border-black rounded-md p-2 hover:cursor-pointer">
                        <QuestionMarkCircleIcon className="w-5 h-5 shrink-0 text-black" />
                        <span className="text-black shrink-0">
                            Câu hỏi thứ {props.questionIndex + 1}/{props.questionCount}
                        </span>
                    </div>
                </MenuHandler>
                <MenuList className="max-h-[200px]">
                    {loopArray.map((item, index) => {
                        return (
                            <MenuItem
                                onClick={() => handleChoseQuestion(index)}
                                className={`hover:bg-gray-300 my-1 w-full h-full ${
                                    index === props.questionIndex ? "bg-gray-200" : ""
                                }`}
                            >
                                <span className="text-black">Câu {index + 1}</span>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
        </>
    );
};

export default QuestionCounter;
