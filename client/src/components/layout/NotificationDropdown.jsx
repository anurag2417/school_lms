import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data.data);
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-500 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-slate-100">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 flex flex-col items-center">
                <Bell className="h-8 w-8 text-slate-200 mb-2" />
                No notifications right now.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-primary-50/50' : ''}`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Info className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium text-slate-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="shrink-0 flex items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                            className="p-1 text-primary-600 hover:bg-primary-100 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
