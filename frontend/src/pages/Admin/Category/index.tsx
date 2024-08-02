import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import CategoryCard from "./CategoryCard";
import PopupAddCategory from "./PopupAddCategory";
import PopupEditCategory from "./PopupEditCategory";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { categoryActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import { DeleteModal } from "../../../components";
import Loading from "../../Loading";
const CategoryAdmin = () => {
    const [isOpenAddCategory, setIsOpenAddCategory] = useState(false);
    const [isOpenEditCategory, setIsOpenEditCategory] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState("");
    const [categoryId, setCategoryId] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const categories = useAppSelector((state) => state.categorySlice.categories);
    const totalPage = useAppSelector((state) => state.categorySlice.totalPage);
    const totalRecord = useAppSelector((state) => state.categorySlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const handleCancelAddCategory = () => {
        setIsOpenAddCategory(!isOpenAddCategory);
    };
    const handleCancelDeleteModel = () => {
        setIsOpenDeleteModel(false);
    };
    const handleOpenDeleteModel = (id: number) => {
        setCategoryId(id);
        setIsOpenDeleteModel(true);
    };
    const handleOpenPopupEdit = (id: number) => {
        setCategoryId(id);
        setIsOpenEditCategory(true);
    };
    const handleCancelEditCategory = () => {
        setIsOpenEditCategory(!isOpenEditCategory);
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
        setUserInput("");
    };
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
    };
    const handleDeleteCategory = () => {
        dispatch(categoryActions.deleteCategory(categoryId)).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(categoryActions.getCategoriesWithPagination({ searchItem: "", pageIndex: 1 }));
                handleCancelDeleteModel();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    useEffect(() => {
        dispatch(categoryActions.getCategoriesWithPagination({ searchItem, pageIndex: 1 }));
    }, [dispatch, searchItem]);
    useEffect(() => {
        dispatch(categoryActions.getCategoriesWithPagination({ searchItem, pageIndex }));
    }, [dispatch, pageIndex]);

    return (
        <>
            {isOpenAddCategory && <PopupAddCategory handleCancelAddCategory={handleCancelAddCategory} />}
            {isOpenEditCategory && (
                <PopupEditCategory categoryId={categoryId} handleCancelEditCategory={handleCancelEditCategory} />
            )}
            {isOpenDeleteModel && (
                <DeleteModal handleCancel={handleCancelDeleteModel} handleDelete={handleDeleteCategory} />
            )}
            {isGetLoading && <Loading />}
            {/* minhscreen */}
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2">
                <div className="w-3/4 px-10 mb-5 flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                    <div className="flex justify-between w-full">
                        <div className="w-3/4 mx-auto">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Từ khóa..."
                                    className="rounded-full py-4 px-10 w-full border-[1px] border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleKeyWordSearch();
                                    }}
                                />
                                <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleReset()} className="text-xl btn btn-outline font-w ">
                            Làm mới
                        </button>{" "}
                    </div>
                    <button
                        onClick={() => setIsOpenAddCategory(!isOpenAddCategory)}
                        className="relative btn-info btn btn-outline  text-xl font-w hover:text-white text-white"
                    >
                        <span className="left-1/2 top-1/2 ">Thêm</span>{" "}
                    </button>{" "}
                </div>
                {categories.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">
                        Không tìm thấy danh mục{" "}
                        {searchItem && (
                            <span>
                                với từ khoá <span className="italic">"{searchItem}"</span>
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">Có {totalRecord} danh mục được tìm thấy </p>
                )}
                <div className="flex-1  my-1  w-3/4 px-10 justify-start">
                    {categories.map((category, index) => {
                        return (
                            <div className="w-full my-1 max-w-xs tablet:max-w-full " key={index}>
                                <CategoryCard
                                    category={category}
                                    handleOpenPopupEdit={handleOpenPopupEdit}
                                    handleOpenDeleteModel={handleOpenDeleteModel}
                                />
                            </div>
                        );
                    })}
                    {totalPage > 1 && (
                        <div className="flex justify-end my-4">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryAdmin;
