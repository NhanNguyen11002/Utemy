import React, { useState } from "react";
// import logo from "../../../assets/images/utemy_logo_notext.png";
import { Coupon } from "../../../types/coupon";

type CouponCardProps = {
    coupon: Coupon;
    handleOpenDeleteModel(id: number): void;
    handleOpenPopupEdit(id: number, event_id: number | null): void;
};
const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
const CouponCard: React.FC<CouponCardProps> = (props) => {
    const [hovered, setHovered] = useState(false);
    return (
        <>
            <div
                className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="p-1 flex flex-row justify-between">
                    <div className="p-1 flex flex-row justify-between">
                        <div className="flex flex-col items-start">
                            <div className="ml-4 items-center leading-7 tracking-wider">
                                <h1 className="text-gray-900 text-2xl font-semibold ">ID: {props.coupon.coupon_id}</h1>
                            </div>

                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Mã giảm giá:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">{props.coupon.code}</p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Phần trăm giảm giá:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.coupon.discount*100+"%"}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Số lượng còn lại:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.coupon.remain_quantity}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Ngày bắt đầu mở:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {formatDate(props.coupon.valid_start)}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Ngày kết thúc:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {formatDate(props.coupon.valid_until)}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Giá giảm tối đa:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.coupon.max_discount_money+" VNĐ"}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Voucher cho sự kiện?:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.coupon.is_event ? "Có" : "Không"}
                                </p>
                            </div>
                            {props.coupon.event_name !== null && (
                                <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                    <h1 className="text-black font-bold text-lg"> Tên sự kiện:</h1>
                                    <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                        {props.coupon.event_name}
                                    </p>
                                </div>
                            )}


                        </div>
                    </div>

                    <div className={`${hovered ? "block" : "hidden"} flex flex-col mr-1`}>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-info hover:bg-info/70 hover:cursor-pointer rounded-2xl "
                            onClick={() => props.handleOpenPopupEdit(props.coupon.coupon_id, props.coupon.event_id)}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-error hover:bg-error/70 hover:cursor-pointer rounded-2xl"
                            onClick={() => props.handleOpenDeleteModel(props.coupon.coupon_id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CouponCard;
