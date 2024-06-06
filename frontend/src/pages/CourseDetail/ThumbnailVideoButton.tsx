import React from "react";
import { PlayCircleIcon } from "@heroicons/react/24/outline";

type ThumbnailVideoButtonProps = {
    thumbnailSrc: string;
    onClick: () => void;
};
const ThumbnailVideoButton: React.FC<ThumbnailVideoButtonProps> = ({ thumbnailSrc, onClick }) => {
    return (
        <div style={{ position: "relative" }}>
            <img
                src={thumbnailSrc}
                alt="Thumbnail"
                className="h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-contain"
            />
            <button
                onClick={onClick}
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                aria-label="play video"
            >
                <PlayCircleIcon style={{ fontSize: "48px", color: "white" }} />
            </button>
        </div>
    );
};

export default ThumbnailVideoButton;
