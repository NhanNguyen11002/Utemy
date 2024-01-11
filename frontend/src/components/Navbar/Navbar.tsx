import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Category } from "../../types/category";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const categoriesList: Category[] = useAppSelector((state) => state.categorySlice.top5categories) ?? [];

    useEffect(() => {
        dispatch(categoryActions.get5Categories());
    }, [dispatch]);

    return (
        <>
            <div className="hidden w-full h-[80px] bg-navy mt-[100px] laptop:flex">
                <ul className="min-w-fit px-20 flex justify-center mx-auto">
                    {categoriesList.length > 0 &&
                        categoriesList.map((category, index) => {
                            return (
                                <NavLink
                                    key={category.category_id}
                                    to={`/all-courses?category=${category.category_id}`}
                                >
                                    <li
                                        key={category.category_id}
                                        className="text-white hover:bg-navyhover text-lg font-Roboto font-semibold text-center cursor-pointer px-6 py-[26px] min-w-fit"
                                    >
                                        {category.title}
                                    </li>
                                </NavLink>
                            );
                        })}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
