import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import { SearchIcon } from "../../assets/icons";
import UserDropDown from "../Dropdown/UserDropDown";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Category } from "../../types/category";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Badge } from "../ui/badge";
interface HeaderProps {
    isLogin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogin }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const [keyword, setKeyword] = useState<string>("");
    const [isDisplayUserDrawer, setIsDisplayUserDrawer] = useState<boolean>(false);
    const [isDisplayCategoryDrawer, setIsDisplayCategoryDrawer] = useState<boolean>(false);
    const totalCourseInCart = useAppSelector((state) => state.cartSlice.totalCourseInCart);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const categories: Category[] = useAppSelector((state) => state.categorySlice.categories) ?? [];
    const handleKeyWordSearch = () => {
        navigate(`/all-courses?keyword=${keyword}`);
        setKeyword("");
    };

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <header className="w-full h-[70px] max-w-full bg-background shadow-xl fixed top-0 left-0 z-[30]">
                <Toaster />
                <div className="w-full h-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <div className="flex-1 flex gap-4 laptop:gap-[120px] items-center">
                        <Link to={"/"} className="w-[60px] h-[60px] shrink-0">
                            <img src={images.Logo} alt="Logo" />
                        </Link>
                        <div className="laptop:hidden drawer">
                            <input
                                id="my-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                                checked={isDisplayCategoryDrawer}
                                onChange={() => setIsDisplayCategoryDrawer(!isDisplayCategoryDrawer)}
                            />
                            <div className="drawer-content">
                                <label
                                    htmlFor="my-drawer"
                                    className="font-medium hover:text-lightblue transition-all duration-300 drawer-button"
                                >
                                    Danh mục
                                </label>
                            </div>
                            <div className="drawer-side">
                                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                                <ul className="menu p-4 w-80 h-full bg-white text-base-content">
                                    {categories.length > 0 &&
                                        categories.map((category) => {
                                            return (
                                                <NavLink
                                                    to={`/all-courses?category=${category.category_id}`}
                                                    key={category.category_id}
                                                >
                                                    <li
                                                        onClick={() =>
                                                            setIsDisplayCategoryDrawer(!isDisplayCategoryDrawer)
                                                        }
                                                        className="hover:bg-footer text-lg font-medium text-center cursor-pointer px-6 py-4 laptop:py-[26px] min-w-fit rounded-lg"
                                                    >
                                                        {category.title}
                                                    </li>
                                                </NavLink>
                                            );
                                        })}
                                </ul>
                            </div>
                        </div>
                        <div className="hidden laptop:block flex-1 ">
                            <div className="cursor-pointer relative left-1 bottom-2" onClick={handleKeyWordSearch}>
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Điền từ khóa vào đây..."
                                className=" rounded-full py-4 h-[40px] px-10 w-[70%] max-w-[1000px] border-[1px] border-black text-sm"
                                value={keyword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleKeyWordSearch();
                                }}
                            />
                        </div>
                    </div>
                    {isLogin ? (
                        <>
                            <div className="ml-auto flex shrink-0 items-center">
                                <Link
                                    to={"/all-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                                >
                                    Tất cả khóa học
                                </Link>
                                <Link
                                    to={"/my-enrolled-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                                >
                                    Học tập
                                </Link>
                                <Link
                                    to={"/lecturer"}
                                    className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                                >
                                    Giảng viên
                                </Link>
                                <Link
                                    to={"/cart"}
                                    className="hidden tablet:block min-w-fit mr-5 font-normal text-sm hover:text-lightblue transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex flex-row">
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        <Badge
                                            variant="default"
                                            className="bg-lightblue text-xs relative bottom-3 right-2 rounded-full"
                                        >
                                            {totalCourseInCart}
                                        </Badge>
                                    </div>
                                </Link>
                                {/* DRAWER AVATAR */}
                                <div className="drawer drawer-end">
                                    <input
                                        id="user-drawer"
                                        type="checkbox"
                                        className="drawer-toggle"
                                        checked={isDisplayUserDrawer}
                                        onChange={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                    />
                                    <div className="drawer-content">
                                        <label
                                            data-dropdown-toggle="dropdown"
                                            htmlFor="user-drawer"
                                            className="w-[40px] h-[40px] rounded-full flex items-center justify-center relative border-[1px] hover:cursor-pointer"
                                        >
                                            <img
                                                src={avatar ? avatar : images.DefaultAvatar}
                                                alt="A"
                                                className="w-full h-full object-cover rounded-full"
                                                crossOrigin="anonymous"
                                            />
                                        </label>
                                    </div>
                                    <div className="drawer-side">
                                        <label htmlFor="user-drawer" className="drawer-overlay"></label>
                                        <div
                                            className="menu p-4 w-80 h-full bg-white shadow-sm"
                                            onClick={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                        >
                                            <UserDropDown />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-2 flex justify-end items-center gap-3">
                            <Link to={"/all-courses"}>
                                <span className="hidden tablet:block min-w-fit text-sm font-medium hover:text-lightblue transition-all duration-300 cursor-pointer">
                                    Tất cả khóa học
                                </span>
                            </Link>
                            <Link to="/login">
                                <button className="text-white btn btn-sm btn-info hover:bg-btn text-sm">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-sm btn-outline text-sm">Đăng ký</button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
