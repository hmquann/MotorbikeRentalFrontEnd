import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const incrementNotificationCount = () => {
    setNotificationCount(prevCount => prevCount + 1);
  };

  const clearNotificationCount = () => {
    setNotificationCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, incrementNotificationCount, clearNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
