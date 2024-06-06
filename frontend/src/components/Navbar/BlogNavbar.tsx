import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { XIcon, SearchIcon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Category } from "../../types/category";
interface BlogNavbarProps {}

const BlogNavbar: React.FC<BlogNavbarProps> = ({}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searching, setSearching] = useState(false);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const categories: Category[] = useAppSelector((state) => state.categorySlice.top5categories) ?? [];

    useEffect(() => {
        dispatch(categoryActions.get8BlogCategories());
    }, [dispatch]);
    const reset = () => {
        setSearching(false);
        setKeyword("");
        if (inputRef.current) inputRef.current.value = "";
    };
    return (
        <>
            <div className="w-full h-[70px] flex bg-navy shadow-xl fixed top-[70px] left-0 z-[20]">
                <div className="w-full h-[70px] flex relative items-center">
                    <div
                        className={`h-full ${searching ? "w-full" : "w-0"} bg-navy z-[20] block absolute top-0 left-0 transition-all duration-500`}
                    >
                        <div className={`${searching ? "block" : "hidden"} flex items-center gap-2 h-full p-4`}>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Từ khoá tìm blog..."
                                className="w-[95%] bg-navy p-2 text-white focus:outline-none placeholder-white/80 "
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        navigate(`/blog/search?keyword=${keyword}`);
                                        reset();
                                    }
                                }}
                            />
                            <div className="w-[5%]">
                                <XIcon
                                    onClick={() => {
                                        reset();
                                    }}
                                    className="w-6 h-6 text-white ml-5 hover:cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <SearchIcon
                        onClick={() => setSearching(true)}
                        className="w-6 h-6 text-white ml-5 hover:cursor-pointer"
                    />
                    <div className={`h-full w-full flex gap-5 items-center justify-center `}>
                        {categories.map((category) => {
                            return (
                                <p
                                    key={category.category_id}
                                    onClick={() => navigate(`/blog/category/${category.category_id}`)}
                                    className={`text-lg font-semibold max-w-[100px] text-ellipsis truncate text-white hover:cursor-pointer hover:underline underline-offset-1`}
                                >
                                    {category.title}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogNavbar;
