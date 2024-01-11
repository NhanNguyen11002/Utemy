import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { images } from "../../assets";
import { SearchIcon } from "../../assets/icons";
import UserDropDown from "../Dropdown/UserDropDown";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions } from "../../redux/slices";
import { Category } from "../../types/category";
interface HeaderProps {
    isLogin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogin }) => {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const [keyword, setKeyword] = useState<string>("");
    const [isDisplayUserDrawer, setIsDisplayUserDrawer] = useState<boolean>(false);
    const [isDisplayCategoryDrawer, setIsDisplayCategoryDrawer] = useState<boolean>(false);

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
            <header className="w-full h-[100px] max-w-full bg-background shadow-xl fixed top-0 left-0 z-[10]">
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
                                <label htmlFor="my-drawer" className="font-medium hover:opacity-80 drawer-button">
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
                        <div className="hidden relative laptop:block flex-1">
                            <input
                                type="text"
                                placeholder="Điền từ khóa vào đây..."
                                className="rounded-full py-4 px-10 w-[70%] max-w-[700px] border-[1px] border-black"
                                value={keyword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleKeyWordSearch();
                                }}
                            />
                            <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                    {isLogin ? (
                        <>
                            <div className="ml-auto flex shrink-0 items-center">
                                <Link
                                    to={"/all-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    Tất cả khóa học
                                </Link>
                                <Link
                                    to={"/my-enrolled-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    Khóa học đã đăng ký
                                </Link>
                                <Link
                                    to={"/my-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    Khóa học của tôi
                                </Link>
                                <Link
                                    to={"/cart"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    Giỏ hàng
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
                                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center relative border-[1px] hover:cursor-pointer"
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
                                <span className="hidden tablet:block min-w-fit font-medium hover:opacity-80 cursor-pointer">
                                    Tất cả khóa học
                                </span>
                            </Link>
                            <Link to="/login">
                                <button className="text-white btn btn-info hover:bg-btn text-lg">Đăng nhập</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-outline text-lg">Đăng ký</button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
