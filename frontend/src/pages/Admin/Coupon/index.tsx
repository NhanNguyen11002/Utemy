import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import CouponCard from "./CouponCard";
import PopUpAddCoupon from "./PopUpAddCoupon";
import PopUpEditCoupon from "./PopUpEditCoupon";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { couponActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import { DeleteModal } from "../../../components";
import Loading from "../../Loading";
const CouponAdmin = () => {
    const [isOpenAddCoupon, setIsOpenAddCoupon] = useState(false);
    const [isOpenEditCoupon, setIsOpenEditCoupon] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState("");
    // const [couponCode] = useState("");
    const [couponId, setCouponId] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const coupons = useAppSelector((state) => state.couponSlice.coupons);
    const totalPage = useAppSelector((state) => state.couponSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.couponSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    const handleCancelAddCoupon = () => {
        setIsOpenAddCoupon(!isOpenAddCoupon);
    };
    const handleCancelDeleteModel = () => {
        setIsOpenDeleteModel(false);
    };
    const handleOpenDeleteModel = (id: number) => {
        setCouponId(id);
        setIsOpenDeleteModel(true);
    };
    const handleOpenPopupEdit = (id: number) => {
        setCouponId(id);
        setIsOpenEditCoupon(true);
    };
    const handleCancelEditCoupon = () => {
        setIsOpenEditCoupon(!isOpenEditCoupon);
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
    const handleDeleteCoupon = () => {
        dispatch(couponActions.deleteCoupon(couponId)).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(couponActions.getCouponsWithPagination({ searchItem: "", pageIndex: 1 }));
                handleCancelDeleteModel();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    useEffect(() => {
        console.log("Total page:", totalPage); // Log the current value of 'coupons' to the console
        console.log("Total record:", totalRecord); // Log the current value of 'coupons' to the console
        dispatch(couponActions.getCouponsWithPagination({ searchItem, pageIndex }));
    }, [dispatch, searchItem, pageIndex]);

    return (
        <>
            {isOpenAddCoupon && <PopUpAddCoupon handleCancelAddCoupon={handleCancelAddCoupon} />}
            {isOpenEditCoupon && (
                <PopUpEditCoupon couponId={couponId} handleCancelEditCoupon={handleCancelEditCoupon}/>
            )}
            {isOpenDeleteModel && (
                <DeleteModal handleCancel={handleCancelDeleteModel} handleDelete={handleDeleteCoupon} />
            )}
            {isGetLoading && <Loading />}
            {/* minhscreen */}
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2">
                {/* <Toaster /> */}
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
                        onClick={() => setIsOpenAddCoupon(!isOpenAddCoupon)}
                        className="relative btn-info btn btn-outline  text-xl font-w hover:text-white text-white"
                    >
                        <span className="left-1/2 top-1/2 ">Thêm</span>{" "}
                    </button>{" "}
                </div>
                {coupons.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy phiếu giảm giá</p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">Có {totalRecord} phiếu giảm giá được tìm thấy </p>
                )}
                <div className="flex-1  my-1  w-3/4 px-10 justify-start">
                    {coupons.map((coupon, index) => {
                        return (
                            <div className="w-full my-1 max-w-xs tablet:max-w-full " key={index}>
                                <CouponCard
                                    coupon={coupon}
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

export default CouponAdmin;
