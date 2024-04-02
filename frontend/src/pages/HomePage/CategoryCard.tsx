import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CategoryProps {
    id: number;
    title: string;
    thumbnail: string;
}

const CategoryCard: React.FC<CategoryProps> = (props) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Link to={`/all-courses?category=${props.id}`}>
            <div
                className="rounded-lg  flex flex-col justify-between cursor-pointer h-[300px] max-w-[300px] p-2 mb-2"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="flex bg-background_2 justify-center items-center object-cover h-[95%]">
                    <img
                        src={props.thumbnail}
                        alt="CategoryImage"
                        className={` ${hovered ? "scale-95" : ""} transition-all duration-300 w-[75%] h-[75%] `}
                    />
                </div>
                <h2 className="font-bold text-sm truncate text-center h-[8%]">{props.title}</h2>
            </div>
        </Link>
    );
};

export default CategoryCard;
