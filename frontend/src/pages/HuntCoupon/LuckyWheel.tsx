import { useAppSelector } from '../../hooks/hooks';
import { couponActions } from '../../redux/slices';
import { AppDispatch } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types'; // Import WheelData type
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

// Define props interface
interface Props {
  discounts: WheelData[]; // Define props type
  onSpinResult: (result: WheelData | null) => void; // Define prop for handling spin result, accepts null as well
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
  // Hàm để lấy màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  useEffect(() => {
    dispatch(couponActions.getHistorySpinOfUserForAEvent(eventForSpin.id))
        .then((action: any) => {
            if (action.payload.status_code !== 200) {
                setNumberOfTurn(1);
            } else {
                setNumberOfTurn(0);
            }
        });
}, []);

  const handleSpinClick = () => {
    dispatch(couponActions.getHistorySpinOfUserForAEvent(eventForSpin.id))
        .then((action: any) => {
          if(action.payload.status_code !==200)
          {
            // Clear the previous spin result
            onSpinResult(null);

            // Generate a random prize number
            const newPrizeNumber = Math.floor(Math.random() * wheelDataWithGoodLuckMessage.length);
            // Set the prize number and start spinning
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
            // Call the parent component's spin result handler with the selected discount
            // setTimeout(() => {
            //     onSpinResult(discounts[newPrizeNumber]);
            //   }, 3000); // Display the result after 3 seconds (3000 milliseconds)
            setNumberOfTurn(0);
          }
          else{
            toast.error("Bạn đã quay vòng quay cho sự kiện này rồi!!")
          }
        })
    
    };

    // Thêm ô "Chúc bạn may mắn lần sau" vào mảng discounts
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '10px' }}> {/* Margin dưới */}
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelDataWithGoodLuckMessage}
          backgroundColors={Array.from({ length: wheelDataWithGoodLuckMessage.length }, getRandomColor)}
          outerBorderColor= 'white'
          // outerBorderWidth= {5}
          innerRadius={20}
          innerBorderColor = "blue"
          innerBorderWidth= {10}
          radiusLineColor	="white"
          radiusLineWidth	={8}
          perpendicularText={true}
          onStopSpinning={() => {
            setMustSpin(false);
            const selectedDiscount = wheelDataWithGoodLuckMessage[prizeNumber];
            if (selectedDiscount.option !== null) {
              onSpinResult(selectedDiscount);
            }
            else {
              toast.error("Thật tiếc quá, chúc bạn may mắn lần sau")
            }
            
          }}
        />
      </div>
      <button 
        style={{ 
          backgroundColor: 'blue', // Màu nền của button
          color: 'white', // Màu chữ của button
          padding: '10px 20px', // Padding của button
          border: 'none', // Loại bỏ border
          borderRadius: '5px' // Bo góc của button
        }} 
        onClick={handleSpinClick}
      >
        SPIN
      </button>
      <div>
        Số lượt quay còn lại: {numberOfTurn}
      </div>
    </div>
    )};

export default LuckyWheel;
