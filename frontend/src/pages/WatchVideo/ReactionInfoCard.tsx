import React from "react";
// import logo from "../../../assets/images/utemy_logo_notext.png";
// import { Like } from "../../types/like";
// import { Dislike } from "../../types/dislike";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Link } from "react-router-dom";
import constants from "../../constants";
import { useAppSelector } from "../../hooks/hooks";
import { Reaction } from "../../types/dislike";
type ReactionInfoCardProps = {
    reaction: Reaction;
    // dislike: Dislike;
    handleClick(id: number): void;
};
const ReactionInfoCard: React.FC<ReactionInfoCardProps> = (props) => {
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "Unenrolled";
    return (
        <>
            <Link
                to={role === constants.util.ROLE_AUTHOR ? "/my-profile" : `/profile/${props.reaction.user.user_id}`}
                className=" text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
                <div
                    className="p-1 flex flex-row justify-between items-center cursor-pointer"
                    onClick={() => props.handleClick(props.reaction.id)}
                >
                    <Avatar>
                        <AvatarImage
                            src={props.reaction.user.url_avatar || "https://via.placeholder.com/150"}
                            alt={`${props.reaction.user.first_name} ${props.reaction.user.last_name}`}
                        />
                        <AvatarFallback>{`${props.reaction.user.first_name[0]}${props.reaction.user.last_name[0]}`}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                        <div className="flex flex-row items-center">
                            <h1 className="text-black font-bold text-lg">
                                {props.reaction.user.first_name} {props.reaction.user.last_name}
                            </h1>
                            {/* <p className="ml-2 text-gray-700 font-normal text-lg truncate">
                                {new Date(props.reaction.updatedAt).toLocaleDateString()}
                            </p> */}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default ReactionInfoCard;
