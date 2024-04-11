import React from "react";
// import logo from "../../../assets/images/utemy_logo_notext.png";
import { Event } from "../../../types/event";

type EventCardProps = {
    event: Event;
    handleOpenDeleteModel(id: number): void;
    handleOpenPopupEdit(id: number): void;
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
const EventCard: React.FC<EventCardProps> = (props) => {
    return (
        <>
            <div
                className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
            >
                <div className="p-1 flex flex-row justify-between">
                    <div className="p-1 flex flex-row justify-between">
                        <div className="flex flex-col items-start">
                        <div className="ml-4 items-center leading-7 tracking-wider">
                            <h1 className="text-gray-900 text-2xl font-semibold ">
                                ID: {props.event.event_id}
                            </h1>
                        </div>

                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Tên sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.event.name}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Mô tả sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.event.description}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Ngày bắt đầu sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {formatDate(props.event.start_date)}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Ngày kết thúc sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {formatDate(props.event.end_date)}
                                </p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Tình trạng:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                    {props.event.is_active? 'Đang mở' : 'Chưa mở/Đã kết thúc'}
                                </p>
                            </div>
                            <div className="items-start mt-1 ml-4 overflow-hidden">
                            <h1 className="text-black font-bold text-lg"> Các coupon của sự kiện:</h1>
                                <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã Coupon
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mức Giảm Giá
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày Bắt Đầu
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày Kết Thúc
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {props.event.coupons.map((coupon, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(coupon.valid_start)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(coupon.valid_until)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>


                            
                            {/* {props.coupon.event_name !== null && (
                                <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                    <h1 className="text-black font-bold text-lg"> Tên sự kiện:</h1>
                                    <p className="ml-2 text-gray-700 font-normal text-lg truncate ">
                                        {props.coupon.event_name}
                                    </p>
                                </div>
                            )} */}


                        </div>
                    </div>

                    <div className="flex flex-col mr-1">
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-info hover:bg-info/70 hover:cursor-pointer rounded-2xl "
                            onClick={() => props.handleOpenPopupEdit(props.event.event_id)}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-error hover:bg-error/70 hover:cursor-pointer rounded-2xl"
                            onClick={() => props.handleOpenDeleteModel(props.event.event_id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventCard;
