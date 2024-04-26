import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import CouponCard from "./CouponCard";
import PopUpAddCoupon from "./PopUpAddCoupon";
import PopUpEditCoupon from "./PopUpEditCoupon";
import PopUpDeleteCoupon from "./PopUpDeleteCoupon";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { couponActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
// import { DeleteModal } from "../../../components";
import Loading from "../../Loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
const CouponAdmin = () => {
    const [isOpenAddCoupon, setIsOpenAddCoupon] = useState(false);
    const [isOpenEditCoupon, setIsOpenEditCoupon] = useState(false);
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState("");
    // const [couponCode] = useState("");
    const [couponId, setCouponId] = useState(0);
    const [eventId, setEventId ] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const coupons = useAppSelector((state) => state.couponSlice.coupons);
    const totalPage = useAppSelector((state) => state.couponSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.couponSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const [hoveredRow, setHoveredRow] = useState(null);

    const handleMouseEnter = (index: any) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleRowClick = (coupon: any, event: any) => {
        setSelectedCoupon(coupon);
        // Lấy vị trí của hàng được nhấp chuột
        const rowRect = event.target.getBoundingClientRect();
        const newX = rowRect.left + window.scrollX;
        const newY = rowRect.top + window.scrollY;

        // Cập nhật vị trí của thẻ card
        setCardPosition({ x: newX, y: newY });
    };
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
    const handleOpenPopupEdit = (id: number, event_id: number | null) => {
        setCouponId(id);
        setEventId(event_id);
        setIsOpenEditCoupon(true);
    };
    const handleCancelEditCoupon = () => {
        setIsOpenEditCoupon(!isOpenEditCoupon);
    };
    const handleClosePopupCard = () => {
        setSelectedCoupon(null)    
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
                <PopUpEditCoupon couponId={couponId} eventId={eventId} handleCancelEditCoupon={handleCancelEditCoupon} handleClosePopupCard={handleClosePopupCard}/>
            )}
            {isOpenDeleteModel && (
                <PopUpDeleteCoupon handleCancel={handleCancelDeleteModel} handleDelete={handleDeleteCoupon} handleClosePopupCard={handleClosePopupCard}/>
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
                        onClick={() => setIsOpenAddCoupon(!isOpenAddCoupon)}
                        className="relative btn-info btn btn-outline  text-xl font-w hover:text-white text-white"
                    >
                        <span className="left-1/2 top-1/2 ">Thêm</span>{" "}
                    </button>{" "}
                </div>
                {coupons.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy phiếu giảm giá</p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">
                        Có {totalRecord} phiếu giảm giá được tìm thấy{" "}
                    </p>
                )}
                <div className="flex-1  my-1  w-3/4 px-10 justify-start">
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/3">Mã coupon</TableHead>
                                <TableHead className="w-1/3">Mức giảm giá</TableHead>
                                <TableHead className="w-1/3">Sự kiện</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Sử dụng vòng lặp map để render các hàng dữ liệu */}
                            {coupons.map((coupon, index) => (
                                <TableRow key={index}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                style={{ background: hoveredRow === index ? '#f0f0f0' : 'transparent' }} 
                                onClick={(event) => handleRowClick(coupon, event)}>
                                    <TableCell className="w-1/3">
                                        <p>{coupon.code}</p>
                                    </TableCell>
                                    <TableCell className="w-1/3">
                                        <p>{coupon.discount * 100 + "%"}</p>
                                    </TableCell>
                                    <TableCell className="w-1/3">
                                        <p>{coupon.event_name}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {selectedCoupon && (
                        <div className="absolute top-28 right-0 z-50 w-2/5 h-max flex justify-center items-center "
                            style={{ top: cardPosition.y, left: cardPosition.x }}>
                            <div className="flex-1  my-1  w-1/2 px-10 justify-start">
                                <CouponCard
                                    coupon={selectedCoupon}
                                    handleOpenPopupEdit={handleOpenPopupEdit}
                                    handleOpenDeleteModel={handleOpenDeleteModel}
                                    handleClosePopupCard={handleClosePopupCard}
                                />
                            </div>
                        </div>
                    )}

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
