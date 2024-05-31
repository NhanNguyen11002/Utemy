import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Category } from "../../types/category";
interface BlogNavbarProps {}

const BlogNavbar: React.FC<BlogNavbarProps> = ({}) => {
    const [searching, setSearching] = useState(false);
    const navigate = useNavigate();
    console.log(searching, setSearching, navigate);
    const dispatch = useAppDispatch();
    const categories: Category[] = useAppSelector((state) => state.categorySlice.categories) ?? [];
    console.log(categories.length);

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <div className="w-full h-[70px] flex bg-navy shadow-xl fixed top-[70px] left-0 z-[30]">
                <div className="w-full h-[70px] flex relative">
                    <div
                        className={`h-full ${searching ? "w-full" : "w-0"} bg-navy z-[20] block absolute top-0 left-0 transition-all duration-500`}
                    >
                        <div className={`${searching ? "block" : "hidden"} flex items-center gap-2 h-full p-4`}>
                            <input
                                type="text"
                                placeholder="Từ khoá tìm blog..."
                                className="w-[95%] bg-navy p-2 text-white focus:outline-none placeholder-white/80"
                            />
                            <div className="w-[5%]">
                                <button onClick={() => setSearching(false)} className="border  border-white">
                                    set false
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSearching(true)} className="border border-white">
                        set true
                    </button>
                    <div className={`h-full w-full flex gap-5 items-center justify-center `}>
                        {categories.map((category) => {
                            return (
                                <p
                                    className={`text-lg text-white hover:cursor-pointer hover:underline underline-offset-1`}
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
