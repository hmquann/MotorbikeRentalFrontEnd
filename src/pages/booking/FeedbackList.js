  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { FaEdit } from "react-icons/fa";
  import { MdDelete } from "react-icons/md";
  import { FaStar } from "react-icons/fa";
  import StarRatings from 'react-star-ratings';
  import { Rating } from '@mui/material';
import apiClient from '../../axiosConfig';
import { Modal } from 'react-bootstrap';

  const modalOverlayClasses =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ";
  const modalContentClasses = "bg-white p-4 rounded-lg shadow-lg max-w-md w-full";
  const cancelButtonClasses =
    "hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg";
  const yesButtonClasses =
    "hover:bg-green-600 bg-green-500 text-white px-4 py-2 rounded-lg mr-2";

  const FeedbackList = ({ motorbikeId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingContent, setEditingContent] = useState('');
    const [editingRate, setEditingRate] = useState(0);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);

    useEffect(() => {
      const fetchFeedbacks = async () => {
        try {
          const response = await apiClient.get(`/api/feedback/${motorbikeId}/feedbacks`);
          setFeedbacks(response.data);
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
          // Xử lý lỗi nếu cần
        }
      };
      const fetchCurrentUser = async () => {
        try {
          const id = JSON.parse(localStorage.getItem("user")).userId
          const response = await apiClient.get(`/api/user/${id}`); 
          setCurrentUser(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          // Xử lý lỗi nếu cần
        }
      };

      if (motorbikeId) {
        fetchFeedbacks();
      }

      fetchCurrentUser();
    }, [motorbikeId]);

    const getFullName = (user) => `${user.firstName} ${user.lastName}`;

    const formatDate = (dateString) => {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const calculateAverageRating = () => {
      if (feedbacks.length === 0) return 0;
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rate, 0);
      return (totalRating / feedbacks.length).toFixed(1);
    };

    const averageRating = calculateAverageRating();

    const openModal = (feedback) => {
      setFeedbackToDelete(feedback);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setFeedbackToDelete(null);
      setIsModalOpen(false);
    };

    const handleDelete = async () => {
      try {
        const response = await apiClient.delete(`/api/feedback/delete/${feedbackToDelete.id}`);
        if (response.status === 200) {
          const fetchFeedbacks = async () => {
            try {
              const response = await apiClient.get(`/api/feedback/${motorbikeId}/feedbacks`);
              const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== feedbackToDelete.id);
              setFeedbacks(updatedFeedbacks);
            } catch (error) {
              console.error('Error fetching feedbacks:', error);
            }
          };
          fetchFeedbacks();
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      } finally {
        closeModal();
      }
    };

    const handleEdit = (feedback) => {
      setIsEditing(true);
      setEditingContent(feedback.feedbackContent);
      setEditingRate(feedback.rate);
      setEditingFeedbackId(feedback.id);
    };

    const handleUpdate = async () => {
      try {
        const response = await apiClient.patch(`/api/feedback/update/${editingFeedbackId}`, {
          feedbackContent: editingContent,
          rate: editingRate
        },
        { 
          headers :{
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }

      });
        if (response.status === 200) {
          const updatedFeedback = response.data;
        setFeedbacks(feedbacks.map(feedback =>
          feedback.id === editingFeedbackId ? updatedFeedback : feedback
        ));
          setIsEditing(false);
          setEditingContent('');
          setEditingRate(0);
          setEditingFeedbackId(null);
        }
      } catch (error) {
        console.error('Error updating feedback:', error);
      }
    };

    return (
      <div className="p-4 font-manrope">
        <div className="flex items-center  mb-4">
          <span className="text-yellow-500">⭐</span>
          <span className="ml-1 font-bold">{averageRating}</span>
          <span className="mx-2 font-thin">•</span>
          <span>{feedbacks.length} Đánh giá</span>
        </div>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-card p-4 rounded-lg shadow-sm border border-border">
            {isEditing && editingFeedbackId === feedback.id ? (
                <div>
                  <div className='flex justify-start items-center mb-3'>
                  <img src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png" alt={`${feedback.renterName} Avatar`} className="w-16 h-16 rounded-full mr-4" />
                  <div className="font-semibold text-lg text-foreground">{feedback.renterName}</div>
                  </div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="flex items-center mt-2">
                    <Rating
                      value={editingRate}
                      onChange={(event, newValue) => setEditingRate(newValue)}
                      max={5}
                      precision={1}
                      // size="small"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 font-semibold rounded-lg mr-2 transition hover:scale-105">Lưu</button>
                    <button onClick={() => setIsEditing(false)} className="bg-red-500 hover:bg-red-600 font-semibold text-white px-4 py-2 rounded-lg transition hover:scale-105">Hủy</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <img src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png" alt={`${feedback.renterName} Avatar`} className="w-16 h-16 rounded-full mr-4" />
                      <div>
                        <div className="font-semibold text-lg text-foreground">{feedback.renterName}</div>
                        <div className="flex items-center text-yellow-500 mt-1">
                          {Array.from({ length: feedback.rate }, (_, index) => (
                            <span key={index}>⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-zinc-500">{formatDate(feedback.feedbackTime)}</div>
                  </div>
                  <p className="text-muted-foreground mt-4 font-base text-zinc-500">{feedback.feedbackContent}</p>
                  {currentUser && getFullName(currentUser) === feedback.renterName && (
                    <div className="flex justify-end mt-2">
                      <button onClick={() => handleEdit(feedback)} className="text-blue-500 mr-2"><FaEdit /></button>
                      <button onClick={() => openModal(feedback)} className="text-red-500"><MdDelete /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {isModalOpen && (
          <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} className='font-manrope'>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-zinc-800 mb-4">
              Bạn có chắc chắn muốn xóa đánh giá này?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 font-semibold rounded-lg mr-2 transition hover:scale-105" onClick={() => setIsModalOpen(false)}>
              Hủy
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition hover:scale-105" onClick={handleDelete}>
              Xóa
            </button>
          </Modal.Footer>
        </Modal>
        )}
      </div>
    );
  };

  export default FeedbackList;
