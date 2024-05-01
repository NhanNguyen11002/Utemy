import { EnrolledAuthor } from "@/types/user";
import React from "react";
import { images } from "../../assets";
import { useAppSelector } from "../../hooks/hooks";
import { UserCircleIcon, StarIcon } from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

interface CategoryProps {
    lecturer: EnrolledAuthor;
}

const LecturerCard: React.FC<CategoryProps> = ({ lecturer }) => {
    const userId = useAppSelector((state) => state.authSlice.user.user_id);
    // const color = "purple yellow pink blue green orange red".split(" ");
    // const getColor = () => {
    //     return `bg-${color[Math.floor(Math.random() * 7)]}-300`;
    // };

    return (
        <>
            <div
                className="flex gap-8 w-full h-[500px] relative items-center justify-center text-start "
                id={`lecturerCard${lecturer.user_id}`}
            >
                <div
                    className={`w-72 h-72 bg-purple-300 absolute bottom-6 -left-4 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <div
                    className={`w-72 h-72 bg-red-300 absolute -top-4 left-16 rounded-full z-0 mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <div
                    className={`w-72 h-72 bg-blue-300 absolute bottom-10 left-64 rounded-full z-0 mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <div
                    className={`w-72 h-72 bg-orange-300 absolute top-4 right-6 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <div
                    className={`w-72 h-72 bg-green-300 absolute -bottom-4 -right-4 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <div
                    className={`w-72 h-72 bg-pink-300 absolute top-20 right-40 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob`}
                ></div>
                <img
                    src={lecturer.url_avatar || images.DefaultAvatar}
                    alt="avatar"
                    className="w-[300px] h-[300px] rounded-full border-black border self-center z-10 bg-red"
                />
                <div className="flex flex-col w-[300px] h-[300px] text-start gap-2 z-10">
                    <a
                        className="text-5xl text-bold hover:underline"
                        href={`${userId === lecturer.user_id ? "/my-profile" : `/profile/${lecturer.user_id}`}/`}
                    >
                        {lecturer.first_name} {lecturer.last_name}
                    </a>
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1 items-center">
                            <p>{lecturer.number_of_enrolled_all_course}</p>
                            <UserCircleIcon className="w-4 h-4" />
                        </div>
                        <div className="flex gap-1 items-center">
                            <p> - {lecturer.average_rating_all_course}</p>
                            <StarIcon className="w-4 h-4 fill-yellow-300" />
                        </div>
                    </div>
                    <div className="ql-snow">
                        <div
                            className="overflow-hidden text-ellipsis max-h-[250px] ql-editor"
                            dangerouslySetInnerHTML={{ __html: ` ${lecturer.description} ` }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LecturerCard;
