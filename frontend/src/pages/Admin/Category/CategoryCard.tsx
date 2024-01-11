import React from "react";
import logo from "../../../assets/images/utemy_logo_notext.png";
import { Category } from "../../../types/category";

type CategoryCardProps = {
    category: Category;
    handleOpenDeleteModel(id: number): void;
    handleOpenPopupEdit(id: number): void;
};

const CategoryCard: React.FC<CategoryCardProps> = (props) => {
    return (
        <>
            <div
                className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
            >
                <div className="p-1 flex flex-row justify-between">
                    <div className="p-1 flex flex-row justify-between">
                        <div className="w-[130px] h-[130px] flex items-center justify-center bg-white shadow  rounded-md">
                            <img
                                className="w-[130px] h-[130px] my-3 rounded-md border border-gray-400"
                                alt="category_image"
                                src={props.category.url_image ? props.category.url_image : logo}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="ml-4 items-center leading-7 tracking-wider">
                                <h1 className="text-gray-900 text-2xl font-semibold ">{props.category.title}</h1>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Mô tả:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.category.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mr-1">
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-info hover:bg-info/70 hover:cursor-pointer rounded-2xl "
                            onClick={() => props.handleOpenPopupEdit(props.category.category_id)}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-error hover:bg-error/70 hover:cursor-pointer rounded-2xl"
                            onClick={() => props.handleOpenDeleteModel(props.category.category_id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryCard;
