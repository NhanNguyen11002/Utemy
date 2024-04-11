import { useAppSelector } from '../../hooks/hooks';
import { couponActions } from '../../redux/slices';
import { AppDispatch } from '@/redux/store';
import React, { useState } from 'react';
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
  const goodLuckOption = 'Chúc bạn may mắn lần sau'; // Option text for "Good luck" message
  const wheelDataWithGoodLuckMessage: WheelData[] = [
    ...discounts,
    { option: 'Chúc bạn may mắn lần sau' , style: { fontSize: 12 } }
  ];
  const dispatch = useDispatch<AppDispatch>();
  const eventForSpin = useAppSelector((state) => state.eventSlice.eventForSpin);
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
          onStopSpinning={() => {
            setMustSpin(false);
            const selectedDiscount = wheelDataWithGoodLuckMessage[prizeNumber];
            if (selectedDiscount.option !== goodLuckOption) {
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
    </div>
    )};

export default LuckyWheel;
