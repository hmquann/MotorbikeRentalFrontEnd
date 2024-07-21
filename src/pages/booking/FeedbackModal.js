import {React, useState} from 'react';
import { Rating } from '@mui/material';
import axios from 'axios';

const cardClass = "max-w-sm mx-auto p-3 bg-card text-card-foreground rounded-lg shadow-md";
const buttonClass = "py-2 px-4";
const buttonContainerClasses = "flex border border-zinc-300 rounded-md";
const primaryButtonClass = "w-1/2 p-2 hover:bg-yellow-500";
const secondaryButtonClass = "w-1/2 p-2 border-r border-zinc-300 hover:bg-red-500";

const FeedbackModal = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [feedbackContent, setFeedbackContent] = useState("");
    const [rating, setRating] = useState(0);

    const handleSkip = () => {
      setIsVisible(false);
    };
    const handleSendReview = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/feedback/sendFeedback",
            {  feedbackContent, rate: rating },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          if (response.status === 201) {
            console.log('Review sent');
            setIsVisible(false);
          } else {
            console.error('Failed to send review');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    if (!isVisible) return null;
  return (
    <div className={cardClass}>
      <h2 className="text-lg font-semibold text-center mb-2">Đánh giá chuyến đi của bạn </h2>
      <p className="text-center text-muted-foreground mb-4">Bạn có thích chuyến đi này không, hãy cho chúng tôi biết suy nghĩ của bạn </p>
      <div className="flex justify-center mb-4">
      <Rating />
      </div>
      <textarea className="w-full h-24 p-2 border border-border rounded-md mb-4" placeholder="Nhận xét của bạn..."></textarea>
 
        <div className={buttonContainerClasses}>

        <button className={`${buttonClass} ${secondaryButtonClass}`} onClick={handleSkip}>Bỏ qua</button>
        <button className={`${buttonClass} ${primaryButtonClass}`} onClick={handleSendReview}>Gửi đánh giá</button>
        </div>
        
 
    </div>
  );
};

export default FeedbackModal;
