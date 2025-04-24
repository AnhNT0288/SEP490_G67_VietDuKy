import React, { useState, useEffect } from 'react';
import { connectToSocket, onNewNotification, disconnectSocket } from '../services/socketService';
import { getNotifications } from '../services/notificationService';
import '../styles/NotificationCenter.css';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Kết nối Socket.IO
    connectToSocket(userId);

    // Lắng nghe thông báo mới
    onNewNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    // Lấy danh sách thông báo ban đầu
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Cleanup
    return () => {
      disconnectSocket();
    };
  }, [userId]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-center">
      <button onClick={toggleNotifications} className="notification-button">
        Thông báo ({notifications.length})
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-item">Không có thông báo mới</div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 