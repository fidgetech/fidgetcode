import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const setNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const clearNotification = () => setMessage(null);

  return (
    <NotificationContext.Provider value={{ message, setNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
