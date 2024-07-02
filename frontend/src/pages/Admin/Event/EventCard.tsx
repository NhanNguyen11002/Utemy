import React, { useEffect, useState } from "react";
// import logo from "../../../assets/images/utemy_logo_notext.png";
import { Event } from "../../../types/event";
import { Button } from "../../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { GripIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { couponActions, eventActions } from "../../../redux/slices";
import { DeleteModal } from "../../../components";

type EventCardProps = {
    event: Event;
    handleOpenDeleteModel(id: number): void;
    handleOpenPopupEdit(id: number): void;
};
const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const EventCard: React.FC<EventCardProps> = (props) => {
    const [isUpdateRatioDialogOpen, setIsUpdateRatioDialogOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState(Number);
    const [ratioValue, setRatioValue] = useState("");
    const [tempRates, setTempRates] = useState({});
    const [rowCount, setRowCount] = useState(0);
    const dispatch = useAppDispatch();
    useEffect(() => {
        setRowCount(props.event.coupons.length);
    }, [props.event.coupons]);
    const handleUpdateRatio = (couponId: number) => {
        setSelectedCouponId(couponId);
        setIsUpdateRatioDialogOpen(true);
        dispatch(couponActions.getCouponByIdOnDate(couponId));
    };
    const handleResetRatio = (couponId: any) => {
        // Logic to reset ratio

        // Sao chép mảng tempRates để không làm thay đổi trực tiếp mảng gốc
        const updatedTempRates = { ...tempRates };

        // Xóa phần tử có couponId tương ứng khỏi mảng tempRates
        delete (updatedTempRates as any)[couponId];

        // Cập nhật lại state với mảng tempRates đã được xóa phần tử
        setTempRates(updatedTempRates);
    };
    const coupon = useAppSelector((state) => state.couponSlice.coupon);

    const initialValues: any = {
        coupon_id: coupon.coupon_id,
        ratio: coupon.ratio?.ratio || 0,
    };
    const handleSaveRatio = () => {
        if (Number(ratioValue) < 1 || Number(ratioValue) > 99) toast.error("Tỉ lệ phải lớn hơn 1 và nhỏ hơn 100");
        else {
            setTempRates({
                ...tempRates,
                [selectedCouponId]: ratioValue,
            });
            // Logic to save the new ratio
            setIsUpdateRatioDialogOpen(false);
            setRatioValue("");
        }
    };

    const handleCancel = () => {
        setIsUpdateRatioDialogOpen(false);
        setRatioValue("");
    };
    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false);

    const handleCancelDeleteModel = () => {
        setIsOpenDeleteModel(false); // Ẩn modal khi hủy
    };

    const handleDeleteAllRates = () => {
        if (totalRatio === 0) {
            toast.error("Các coupon của sự kiện này chưa có tỉ lệ");
        } else {
            props.event.coupons.forEach((coupon) => {
                dispatch(couponActions.deleteRatio({ coupon_id: coupon.coupon_id })).then((response) => {
                    if (response.payload && response.payload.status_code === 200) {
                        dispatch(eventActions.getEventsWithPagination({ searchItem: "", pageIndex: 1 }));
                        setTempRates({});
                    } else {
                        if (response.payload) toast.error(response.payload.message);
                    }
                });
            });
            toast.success("Xóa tỉ lệ cho các coupon thành công");
            setIsOpenDeleteModel(false);
        }
    };
    const deleteAllRates = () => {
        setIsOpenDeleteModel(true);
    };
    const saveAllRates = () => {
        if (Object.keys(tempRates).length < rowCount)
            toast.error("Hãy nhập tỉ lệ cho tất cả các coupon có trong sự kiện này!!!");
        else {
            if (totalTempRate >= 100) {
                toast.error("Tổng tỉ lệ đã bằng hoặc vượt quá 100%, hãy kiểm tra lại");
            } else {
                if (totalRatio === 0) {
                    const promises = Object.entries(tempRates).map(([coupon_id, ratio]) => {
                        return dispatch(
                            couponActions.createRatio({ coupon_id: Number(coupon_id), ratio: Number(ratio) / 100 }),
                        ).then((response) => {
                            if (response.payload && response.payload.status_code === 200) {
                                toast.success(response.payload.message);
                                dispatch(eventActions.getEventsWithPagination({ searchItem: "", pageIndex: 1 }));
                                setTempRates({});
                            } else {
                                if (response.payload) toast.error(response.payload.message);
                            }
                        });
                    });
                    // Đợi tất cả các yêu cầu hoàn thành
                    Promise.all(promises)
                        .then(() => {
                            console.log("All ratios have been saved.");
                        })
                        .catch((error) => {
                            console.error("Error saving some ratios:", error);
                        });
                } else {
                    const promises = Object.entries(tempRates).map(([coupon_id, ratio]) => {
                        return dispatch(
                            couponActions.updateRatio({ coupon_id: Number(coupon_id), ratio: Number(ratio) / 100 }),
                        ).then((response) => {
                            if (response.payload && response.payload.status_code === 200) {
                                toast.success(response.payload.message);
                                dispatch(eventActions.getEventsWithPagination({ searchItem: "", pageIndex: 1 }));
                            } else {
                                if (response.payload) toast.error(response.payload.message);
                            }
                        });
                    });
                    // Đợi tất cả các yêu cầu hoàn thành
                    Promise.all(promises)
                        .then(() => {
                            console.log("All ratios have been saved.");
                        })
                        .catch((error) => {
                            console.error("Error saving some ratios:", error);
                        });
                }
            }
        }
    };

    const totalTempRate = Object.values(tempRates).reduce((acc: number, cur: any) => acc + Number(cur), 0);
    const totalRatio = props.event.coupons.reduce((accumulator, coupon) => {
        // Lấy giá trị của mỗi coupon
        const ratio = (coupon.ratio?.ratio ?? 0) * 100 || 0; // Nếu ratio không tồn tại, sẽ lấy giá trị mặc định là 0
        // Thêm giá trị của coupon này vào tổng
        return accumulator + ratio;
    }, 0);
    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + "...";
        }
        return description;
    };

    return (
        <>
            <div
                className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
            >
                <div className="p-1 flex flex-row justify-between">
                    <div className="p-1 flex flex-row justify-between">
                        <div className="flex flex-col items-start">
                            <div className="ml-4 items-center leading-7 tracking-wider">
                                <h1 className="text-gray-900 text-2xl font-semibold ">ID: {props.event.event_id}</h1>
                            </div>

                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Tên sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate ">{props.event.name}</p>
                            </div>
                            <div className="flex flex-row items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Mô tả sự kiện:</h1>

                                <p className="ml-2 text-gray-700 font-normal text-lg truncate">
                                    {truncateDescription(props.event.description, 100)}
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
                                    {props.event.is_active ? "Đang mở" : "Chưa mở/Đã kết thúc"}
                                </p>
                            </div>
                            <div className="items-start mt-1 ml-4 overflow-hidden">
                                <h1 className="text-black font-bold text-lg"> Các coupon của sự kiện:</h1>
                                {/* <table className="min-w-full divide-y divide-gray-200">
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
                                </table> */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Xem chi tiết</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[1125px]">
                                        <DialogHeader>
                                            <DialogTitle>Các mã coupon của sự kiện này</DialogTitle>
                                            <DialogDescription>
                                                Bạn có thể thay đổi tỉ lệ quay của các mã coupon dưới đây, sau khi thay
                                                đổi xong nhấn lưu để cập nhật
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Mã Coupon
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Mức Giảm Giá
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Ngày Bắt Đầu
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Ngày Kết Thúc
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Tỉ lệ quay trúng
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Giá trị tỉ lệ tạm thời
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Hành động
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {props.event.coupons.map((coupon, index) => (
                                                        <tr
                                                            key={index}
                                                            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {coupon.code}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {coupon.discount}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(coupon.valid_start)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(coupon.valid_until)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {coupon.ratio?.ratio
                                                                    ? (coupon.ratio.ratio * 100).toFixed(0) + "%"
                                                                    : null}
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {(tempRates as any)[coupon.coupon_id]
                                                                    ? (tempRates as any)[coupon.coupon_id] + "%"
                                                                    : null}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <GripIcon className="w-5 h-5" />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="start">
                                                                        <DropdownMenuItem>
                                                                            <p
                                                                                onClick={() =>
                                                                                    handleUpdateRatio(coupon.coupon_id)
                                                                                }
                                                                                className="text-xs font-semibold hover:underline hover:cursor-pointer text-blue-gray-600"
                                                                            >
                                                                                Cập nhật tỉ lệ
                                                                            </p>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <p
                                                                                onClick={() =>
                                                                                    handleResetRatio(coupon.coupon_id)
                                                                                }
                                                                                className="text-xs font-semibold hover:underline hover:cursor-pointer text-red-700"
                                                                            >
                                                                                Reset tỉ lệ
                                                                            </p>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                            {/* Dialog for updating ratio */}
                                                            <Dialog
                                                                open={isUpdateRatioDialogOpen}
                                                                onOpenChange={setIsUpdateRatioDialogOpen}
                                                            >
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Nhập tỉ lệ mới</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="py-4">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Nhập tỉ lệ
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={ratioValue}
                                                                            placeholder={String(
                                                                                initialValues.ratio * 100,
                                                                            )}
                                                                            onChange={(e) =>
                                                                                setRatioValue(e.target.value)
                                                                            }
                                                                            className="mt-1 block w-full"
                                                                        />
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={handleCancel}
                                                                        >
                                                                            Hủy
                                                                        </Button>
                                                                        <Button onClick={handleSaveRatio}>Lưu</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-white">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            Chúc bạn may mắn lần sau
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            0
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            -----------------------------
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            -----------------------------
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {(100 - totalRatio).toFixed(0) === "100"
                                                                ? null
                                                                : (100 - totalRatio).toFixed(0) + "%"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {(100 - totalTempRate).toFixed(0) === "100"
                                                                ? // Nếu kết quả là 1, hiển thị một nội dung trống
                                                                  null
                                                                : // Nếu kết quả không phải là 1, hiển thị kết quả của phép toán
                                                                  (100 - totalTempRate).toFixed(0) + "%"}
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            null
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                                {totalTempRate >= 100 ? (
                                                    <span>
                                                        TỔNG TỈ LỆ (NGOẠI TRỪ CHÚC BẠN MAY MẮN LẦN SAU) PHẢI NHỎ HƠN
                                                        100%, HÃY ĐIỀU CHỈNH NẾU KHÔNG SẼ KHÔNG LƯU ĐƯỢC:{" "}
                                                        {totalTempRate}%
                                                    </span>
                                                ) : (
                                                    <span>TỔNG TỈ LỆ TẠM THỜI: {totalTempRate} %</span>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={deleteAllRates}>
                                                Xóa tất cả tỉ lệ
                                            </Button>
                                            {isOpenDeleteModel && (
                                                <DeleteModal
                                                    handleCancel={handleCancelDeleteModel}
                                                    handleDelete={handleDeleteAllRates}
                                                />
                                            )}
                                            <Button type="submit" onClick={() => setTempRates({})}>
                                                Đặt lại tỉ lệ tạm
                                            </Button>
                                            <Button type="submit" onClick={saveAllRates}>
                                                Lưu
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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
