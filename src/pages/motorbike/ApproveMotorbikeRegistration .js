import React, { useState, useEffect } from 'react';
import axios from 'axios';

const tableCellClasses = 'px-6 py-4 whitespace-nowrap text-base font-semibold text-amber-900 dark:text-purple-300';
const buttonClasses = 'p-2 rounded-lg';
const modalOverlayClasses = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm';
const modalContentClasses = 'bg-white p-4 rounded-lg shadow-lg max-w-md w-full';
const cancelButtonClasses = 'hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg';
const approveButtonClasses = 'hover:bg-green-600 bg-green-500 text-white px-4 py-2 rounded-lg mr-2';

const ApproveMotorbikeRegistration = () => {
  const [motorbikes, setMotorbikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [actionType, setActionType] = useState('');
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    // Fetch the motorbikes with pending status from the API using axios
    axios.get('http://localhost:8080/api/motorbike/pending', { params: { status: 'pending' } })
      .then(response => setMotorbikes(response.data))
      .catch(error => console.error('Error fetching data:', error));

      const role = JSON.parse(localStorage.getItem('roles')); // Assuming role is stored in localStorage
      setUserRole(role);
  }, []);

  const handleAction = (motorbike, action) => {
    setSelectedMotorbike(motorbike);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const url = actionType === 'approve'
      ? `http://localhost:8080/api/motorbike/approve/${selectedMotorbike.id}`
      : `http://localhost:8080/api/motorbike/reject/${selectedMotorbike.id}`;

    axios.post(url)
      .then(response => {
        // Update the motorbikes list
        setMotorbikes(motorbikes.filter(motorbike => motorbike.id !== selectedMotorbike.id));
        setIsModalOpen(false);
      })
      .catch(error => console.error(`Error ${actionType}ing motorbike:`, error));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMotorbike(null);
    setActionType('');
  };
  const isAdmin = userRole.includes('ADMIN');

  return (
    <div className="bg-zinc-300 dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
      <h1 className="text-4xl font-semibold mb-4">Approve For Motorbike Registration</h1>
      </div>
      {isAdmin? (
      <table className="min-w-full table-fixed divide-y divide-gray-400 dark:divide-purple-700 ">
        <thead className="bg-gray-50 dark:bg-purple-800">
          <tr>
            <th className="px-6 py-3 text-left text-xm font-medium text-gray-500 dark:text-purple-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xm font-medium text-gray-500 dark:text-purple-400 uppercase tracking-wider">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-xm font-medium text-gray-500 dark:text-purple-400 uppercase tracking-wider">
              Motorbike Name
            </th>
            <th className="px-6 py-3 text-left text-xm font-medium text-gray-500 dark:text-purple-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-purple-400 dark:divide-purple-700">
          {motorbikes.map(motorbike => (
            <tr key={motorbike.id}
            className='border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-sky-900 dark:text-purple-300">{motorbike.id}</td>
              <td className={tableCellClasses}>{motorbike.user.firstName + " " + motorbike.user.lastName}</td>
              <td className={tableCellClasses}>{motorbike.model.modelName}</td>
              <td className={tableCellClasses}>
                <button
                  className={`hover:bg-green-600 bg-green-500 text-white mr-2 ${buttonClasses}`}
                  onClick={() => handleAction(motorbike, 'approve')}
                >
                  Approve
                </button>
                <button
                  className={`hover:bg-red-600 bg-red-500 text-white ${buttonClasses}`}
                  onClick={() => handleAction(motorbike, 'reject')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ): (
        <p className="text-red-500">You do not have permission to access this page.</p>
      )}

      {isModalOpen && (
        <div className={modalOverlayClasses}>
          <div className={modalContentClasses}>
            <p className="text-lg text-zinc-800 mb-4">
              Are you sure to {actionType} this motorbike?
            </p>
            <div className="flex justify-end">
              <button className={approveButtonClasses} onClick={handleConfirm}>Yes</button>
              <button className={cancelButtonClasses} onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveMotorbikeRegistration;
