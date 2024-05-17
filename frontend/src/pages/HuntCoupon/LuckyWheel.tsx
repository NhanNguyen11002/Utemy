import { useAppSelector } from "../../hooks/hooks";
import { couponActions } from "../../redux/slices";
import { AppDispatch } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
// import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types'; // Import WheelData type
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

// Define props interface
interface Props {
    discounts: WheelData[]; // Define props type
    onSpinResult: (result: WheelData | null) => void; // Define prop for handling spin result, accepts null as well
}
interface WheelData {
    option?: string;
    coupon?: any; // Thêm trường coupon vào đây
    optionSize?: number; // Optional

    // Các trường khác...
}

const LuckyWheel = ({ discounts, onSpinResult }: Props) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [numberOfTurn, setNumberOfTurn] = useState(Number);
    // const goodLuckOption = 'Chúc bạn may mắn lần sau'; // Option text for "Good luck" message
    const wheelDataWithGoodLuckMessage: WheelData[] = [
        ...discounts,
        // { option: 'Chúc bạn may mắn lần sau' , style: { fontSize: 12 } }
    ];
    const dispatch = useDispatch<AppDispatch>();
    const eventForSpin = useAppSelector((state) => state.eventSlice.eventForSpin);
    // const eventCPRatio = useAppSelector((state) => state.couponSlice.eventCPRatio);

    // Hàm để lấy màu ngẫu nhiên
    // const getRandomColor = () => {
    //   const letters = '0123456789ABCDEF';
    //   let color = '#';
    //   for (let i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // };
    const getColor = () => {
        const colors = [
            "#ff5722",
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4caf50",
            "#8bc34a",
            "#cddc39",
            "#ffeb3b",
            "#ffc107",
            "#ff9800",
            "#795548",
            "#607d8b",
            "#9e9e9e",
        ];

        // Chọn một số ngẫu nhiên trong khoảng từ 0 đến độ dài của mảng màu
        const randomIndex = Math.floor(Math.random() * colors.length);

        // Trả về màu ở vị trí ngẫu nhiên được chọn từ mảng màu
        return colors[randomIndex];
    };
    useEffect(() => {
        dispatch(couponActions.getHistorySpinOfUserForAEvent(eventForSpin.id)).then((action: any) => {
            if (action.payload.status_code !== 200) {
                setNumberOfTurn(1);
            } else {
                setNumberOfTurn(0);
            }
        });
    }, []);
    const generateRandomPrize = (validRatios: number[], wheelData: WheelData[]): number | null => {
        const totalRatio = validRatios.reduce((total, ratio) => total + ratio, 0);
        const rand = Math.random();
        let cumulativeProbability = 0;

        for (let i = 0; i < validRatios.length; i++) {
            cumulativeProbability += validRatios[i] / totalRatio;
            if (rand < cumulativeProbability) {
                return i; // Trả về phần tử tương ứng từ mảng wheelData
            }
        }

        return null;
    };
    const handleSpinClick = () => {
        dispatch(couponActions.getHistorySpinOfUserForAEvent(eventForSpin.id)).then((action: any) => {
            if (action.payload.status_code !== 200) {
                // Clear the previous spin result
                onSpinResult(null);
                // Generate a random prize number
                const ratios = discounts.map((discount) => {
                    if (discount && discount.coupon && discount.coupon.ratio && discount.coupon.ratio.ratio) {
                        return discount.coupon.ratio.ratio;
                    } else {
                        console.error("Invalid discount object:", discount);
                        return -1;
                    }
                });
                const validRatios = ratios.filter((ratio) => ratio !== -1);
                const sumOfValidRatios = validRatios.reduce((total, ratio) => total + ratio, 0);
                // Thêm giá trị mới vào mảng validRatios
                validRatios.push(parseFloat(Number(1 - sumOfValidRatios).toFixed(2)));
                console.log("Ratios:", validRatios);
                // const newPrizeNumber = Math.floor(Math.random() * wheelDataWithGoodLuckMessage.length);
                if (validRatios.length > 1) {
                    const newPrizeNumber = generateRandomPrize(validRatios, wheelDataWithGoodLuckMessage);
                    // Set the prize number and start spinning
                    if (newPrizeNumber !== null) {
                        setPrizeNumber(newPrizeNumber);
                    }
                } else {
                    const newPrizeNumber = Math.floor(Math.random() * wheelDataWithGoodLuckMessage.length);
                    setPrizeNumber(newPrizeNumber);
                }
                setMustSpin(true);
                setNumberOfTurn(0);
            } else {
                toast.error("Bạn đã quay vòng quay cho sự kiện này rồi!!");
            }
        });
    };

    // Thêm ô "Chúc bạn may mắn lần sau" vào mảng discounts

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginBottom: "10px" }}>
                {" "}
                {/* Margin dưới */}
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelDataWithGoodLuckMessage}
                    backgroundColors={Array.from({ length: wheelDataWithGoodLuckMessage.length }, getColor)}
                    outerBorderColor="white"
                    // outerBorderWidth= {5}
                    innerRadius={20}
                    innerBorderColor="blue"
                    innerBorderWidth={10}
                    radiusLineColor="white"
                    radiusLineWidth={8}
                    perpendicularText={true}
                    onStopSpinning={() => {
                        setMustSpin(false);
                        const selectedDiscount = wheelDataWithGoodLuckMessage[prizeNumber];
                        if (selectedDiscount.option !== null) {
                            onSpinResult(selectedDiscount);
                        } else {
                            toast.error("Thật tiếc quá, chúc bạn may mắn lần sau");
                        }
                    }}
                />
            </div>
            <button
                style={{
                    backgroundColor: "blue", // Màu nền của button
                    color: "white", // Màu chữ của button
                    padding: "10px 20px", // Padding của button
                    border: "none", // Loại bỏ border
                    borderRadius: "5px", // Bo góc của button
                }}
                onClick={handleSpinClick}
            >
                SPIN
            </button>
            <div>Số lượt quay còn lại: {numberOfTurn}</div>
        </div>
    );
};

export default LuckyWheel;
