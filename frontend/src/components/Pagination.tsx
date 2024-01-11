import React from "react";

interface PaginationProps {
    totalPage: number;
    currentPage: number;
    handleChangePageIndex: (pageIndex: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ handleChangePageIndex, totalPage, currentPage }) => {
    const listItem = [];
    for (let index = 1; index <= totalPage; index++) {
        listItem.push(
            <li
                key={index}
                onClick={() => handleChangePageIndex(index)}
                className={`flex items-center justify-center px-3 h-8 hover:cursor-pointer leading-tight ${
                    index === currentPage
                        ? "flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        : "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                } `}
            >
                {index}
            </li>,
        );
    }
    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="inline-flex -space-x-px text-sm">
                    <li
                        className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(currentPage - 1)}
                    >
                        Prev
                    </li>
                    {listItem}
                    <li
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(currentPage + 1)}
                    >
                        Next
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Pagination;
