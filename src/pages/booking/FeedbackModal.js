import { React, useState,useEffect } from 'react';
import { Rating } from '@mui/material';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const cardClass = "max-w-sm mx-auto p-3 bg-card text-card-foreground rounded-lg shadow-md";
const buttonClass = "py-2 px-4";
const buttonContainerClasses = "flex border border-zinc-300 rounded-md";
const primaryButtonClass = "w-1/2 p-2 hover:bg-yellow-500";
const secondaryButtonClass = "w-1/2 p-2 border-r border-zinc-300 hover:bg-red-500";

const FeedbackModal = ({ show, onHide, bookingId, onFeedbackSubmitted }) => {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const checkFeedbackStatus = async () => {
      try {
        const token = localStorage.getItem('token'); // Hoặc cách bạn lưu token
        const response = await axios.get(
          `https://rentalmotorbikewebapp.azurewebsites.net/api/booking/checkFeedbackStatus/${bookingId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setFeedbackSent(response.data.feedbackSent);
      } catch (error) {
        console.error('Error checking feedback status:', error);
      }
    };
  
    if (show && bookingId) {
      checkFeedbackStatus();
    }
  }, [show, bookingId]);

  const handleSkip = () => {
    onHide();
  };

  const handleSendReview = async () => {
    try {
      const response = await axios.post(
        "https://rentalmotorbikewebapp.azurewebsites.net/api/feedback/sendFeedback",
        { bookingId, feedbackContent, rate: rating },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setFeedbackSent(true);
        onFeedbackSubmitted();
      } else {
        console.error('Failed to send review');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{feedbackSent ? "Cảm ơn bạn!" : "Đánh giá chuyến đi của bạn"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {feedbackSent ? (
          <p className="text-center">Cảm ơn bạn đã gửi đánh giá. Bạn đã đánh giá rồi!</p>
        ) : (
          <div className={cardClass}>
            <p className="text-center text-muted-foreground mb-4">Bạn có thích chuyến đi này không, hãy cho chúng tôi biết suy nghĩ của bạn</p>
            <div className="flex justify-center mb-4">
              <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
            </div>
            <textarea
              className="w-full h-24 p-2 border border-border rounded-md mb-4"
              placeholder="Nhận xét của bạn..."
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
            ></textarea>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSkip}>Bỏ qua</Button>
        {!feedbackSent && <Button variant="primary" onClick={handleSendReview}>Gửi đánh giá</Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
