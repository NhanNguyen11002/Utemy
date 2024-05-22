import { DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import { Lecture } from "../../types/lecture";
import { secondsToMinutesAndSeconds } from "../../utils/helper";
import constants from "../../constants";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../hooks/hooks";\

type FinalTestCardType = {
    role?: string;
    isDoneCourse?: boolean;
    handleToFinalTest?: () => void;
    handleDisplayEditTest?: () => void;
    handleDisplayDeleteModal?: () => void;
    isDisplayEdit: boolean;
    finalTest: any;
};

const FinalTestCard: React.FC<FinalTestCardType> = (props) => {
    const notAllowed = props.role && props.role === constants.util.ROLE_ENROLLED && !props.isDoneCourse;
    return (
        <div
            className={`flex w-full border ${props.isDisplayEdit ? "" : notAllowed ? "" : "hover:cursor-pointer hover:bg-footer"} ${notAllowed ? "opacity-50" : "hover:cursor-pointer hover:bg-footer"} `}
            onClick={() => {
                if (notAllowed) return;
                if (props.handleToFinalTest) props.handleToFinalTest();
            }}
            key={``}
        >
            <div className={`w-[95%] py-4  px-5 flex justify-between`}>
                {" "}
                <div className="flex-col items-center justify-between w-full mr-2">
                    <div className="mb-1">
                        <p className="text-base font-medium">{props.finalTest.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DocumentIcon className="w-3 h-3 shrink-0" />{" "}
                        <p className="text-sm font-normal">
                            {secondsToMinutesAndSeconds(Number(props.finalTest.duration))}
                        </p>
                    </div>
                </div>
                {props.isDisplayEdit && (
                    <div className="flex gap-2 items-center pr-6">
                        <div
                            className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                            onClick={() => {
                                if (props.handleDisplayEditTest) {
                                    props.handleDisplayEditTest();
                                }
                            }}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </div>
                        <div
                            className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                            onClick={() => {
                                if (props.handleDisplayDeleteModal) {
                                    props.handleDisplayDeleteModal(); // props.lecture.id
                                }
                            }}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default FinalTestCard;
