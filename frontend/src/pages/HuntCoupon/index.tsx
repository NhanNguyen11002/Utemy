import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { couponActions, eventActions } from "../../redux/slices";
import LuckyWheel from "./LuckyWheel"; // Import LuckyWheel component
import { AppDispatch } from "@/redux/store";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import styles from "./ribbon.module.css";
// import { images } from "../../assets";
// import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import {
    // ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

interface WheelData {
    option?: string;
    coupon?: any; 
    optionSize?: number; // Optional

    // Các trường khác...
}
const HuntCoupon = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [discounts, setDiscounts] = useState<WheelData[]>([]);
    const [, setResult] = useState<WheelData | null>(null); // State để lưu kết quả của vòng quay
    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllEventCouponByEventId();
        dispatch(eventActions.getActiveEvent());
    }, []); // Chỉ gọi hàm này khi component được render lần đầu
    const eventForSpin = useAppSelector((state) => state.eventSlice.eventForSpin);

    const handleGetAllEventCouponByEventId = () => {
        dispatch(couponActions.getAllEventCouponByEventId(eventForSpin.id))
            .then((action) => {
                const response = action.payload;
                if (response.status_code === 200) {
                    if (response.data.length > 0) {
                        const coupons = response.data || [];
                        const formattedDiscounts: WheelData[] = coupons.map((coupon: any, index: number) => ({
                            option: `${index + 1}`,
                            coupon: coupon, // Gán thông tin về coupon vào đây
                        }));
                        // Thêm lựa chọn "Chúc bạn may mắn lần sau" vào cuối mảng
                        formattedDiscounts.push({
                            option: `${formattedDiscounts.length + 1}`,
                            coupon: "Chúc bạn may mắn lần sau",
                            optionSize: 1,
                        });

                        // Cập nhật lại chỉ số của các lựa chọn nếu cần
                        formattedDiscounts.forEach((discount, index) => {
                            if (discount.option === "Chúc bạn may mắn lần sau") {
                                discount.option = `${formattedDiscounts.length}`;
                            }
                        });
                        
                        setDiscounts(formattedDiscounts);
                        console.log("Discounts:", formattedDiscounts);
                    } else {
                        navigate("/");
                        setTimeout(() => {
                            toast.error("Sự kiện đã kết thúc");
                        }, 1000); //
                    }
                } else {
                    console.error("Error from getAllEventCoupon:", response.message);
                }
            })
            .catch((error) => {
                console.error("Error from getAllEventCoupon:", error);
            });
    };
    const handleSpinResult = (result: WheelData | null) => {
        setResult(result);
        console.log("Spin result:", result);
        if (result !== null && result.coupon) {
            const selectedCoupon = result.coupon;
            console.log("Selected coupon:", selectedCoupon);
            if (selectedCoupon !== "Chúc bạn may mắn lần sau") {
                const couponMessage = `Chúc mừng bạn đã trúng phiếu giảm giá ${selectedCoupon.discount * 100} %!`;
                toast.success(couponMessage);
                const coupon_id = selectedCoupon.id;
                const event_id = selectedCoupon.event_id;

                dispatch(couponActions.createCouponOwner({ coupon_id, event_id }))
                    .then((action) => {
                        // Xử lý kết quả từ dispatch nếu cần
                        if (action.payload?.status_code === 200) {
                            // toast.success(action.payload?.message);
                            handleGetAllEventCouponByEventId();
                        } else {
                            if (action.payload) toast.error(action.payload?.message);
                        }
                    })
                    .catch((error) => {
                        console.error("Error creating owner coupon:", error);
                    });
            } else {
                const event_id = eventForSpin.id;
                toast.error("Thật tiếc quá, chúc bạn may mắn lần sau");
                dispatch(couponActions.createHistoryForGoodLuckNextTime({ event_id })).then((action) => {
                    if (action.payload?.status_code === 200) {
                        // toast.success(action.payload?.message);

                        handleGetAllEventCouponByEventId();
                    } else {
                        if (action.payload) toast.error(action.payload?.message);
                    }
                });
            }
        } 
        // else {
        //     console.error("Invalid result or coupon data.");
        // }
        // handleGetAllEventCoupon();
    };
    // const lastIndex = discounts.length;

    return (
        <div className="w-screen h-screen flex items-center">
            <ResizablePanelGroup
                direction="vertical"
                className="rounded-lg border w-full h-full"
                style={{ backgroundColor: "#ffffff", backgroundSize: "contain", backgroundPosition: "center" }}
            >
                <ResizablePanel defaultSize={15} className="border-red-500">
                    <div className={styles.wrapper}>
                        {/* Your JSX content here */}
                        <h1 className={styles.ribbon}>
                            <i></i>
                            <u>Welcome to {eventForSpin.name} event!</u>
                            <i></i>
                        </h1>
                    </div>
                </ResizablePanel>
                {/* <ResizableHandle /> */}
                <ResizablePanel defaultSize={85} className="border-red-500">
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                        <ResizablePanel
                            defaultSize={30}
                            className="border-red-500"
                        >
                            <div className="flex h-full items-center justify-center ">
                                <div
                                    style={{
                                        marginRight: "50px",
                                        marginLeft: "250px",
                                        marginTop: "-100px",
                                        fontSize: "1.2rem",
                                        fontFamily: "monospace",
                                    }}
                                >
                                                                      <h2>Mô tả sự kiện:</h2>
                                    <Table
                                        className="border"
                                        style={{ border: "2px solid black", borderRadius: "8px" }}
                                    >
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead >Nội dung</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Sử dụng vòng lặp map để render các hàng dữ liệu */}
                                                <TableRow>
                                                    <TableCell className="w-1/3" style={{ fontSize: '18px' }}>
                                                        <p>{eventForSpin.description}</p>
                                                    </TableCell>
                                                </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizablePanel defaultSize={40} className="border-red-500">
                            <div className="flex h-full items-center justify-center">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100vh",
                                    }}
                                >
                                    {/* <button onClick={handleGetAllEventCoupon}>Get All Event Coupon</button> */}
                                    <ToastContainer /> {/* Container cho pop-up */}
                                    {discounts.length > 0 && (
                                        <LuckyWheel discounts={discounts} onSpinResult={handleSpinResult} />
                                    )}
                                    {/* {result && <p>Result: {result.option}</p>} */}
                                </div>
                            </div>
                        </ResizablePanel>
                        {/* <ResizableHandle /> */}
                        <ResizablePanel defaultSize={30} className="border-red-500">
                            <div className="flex h-full items-center justify-center ">
                                <div
                                    style={{
                                        marginRight: "100px",
                                        // marginLeft: "50px",
                                        marginTop: "-100px",
                                        fontSize: "1.2rem",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    <h2>Danh sách phần thưởng:</h2>
                                    <Table
                                        className="border"
                                        style={{ border: "2px solid black", borderRadius: "8px" }}
                                    >
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-1/4">Mã số</TableHead>
                                                <TableHead className="w-2/3">Giá trị phần thưởng</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Sử dụng vòng lặp map để render các hàng dữ liệu */}
                                            {discounts.map((discount, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="w-1/3">
                                                        <p>{index + 1}</p>
                                                    </TableCell>
                                                    <TableCell className="w-1/3">
                                                        <p>
                                                            {isNaN(discount.coupon.discount)
                                                                ? `Chúc bạn may mắn lần sau`
                                                                : `Phiếu giảm giá ${parseInt(
                                                                      (discount.coupon.discount * 100).toString(),
                                                                      10,
                                                                  )}%`}
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default HuntCoupon;
