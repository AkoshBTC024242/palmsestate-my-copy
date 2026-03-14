// src/pages/dashboard/Notifications.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Bell, CheckCircle, AlertCircle, Info,
  XCircle, Clock, Star, Heart, MessageSquare,
  Calendar, Building2, FileText, Trash2,
  CheckCheck, Loader2, Filter
} from 'lucide-react';

function DashboardNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time notifications
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      application: <FileText className="w-5 h-5 text-blue-400" />,
      payment: <CheckCircle className="w-5 h-5 text-green-400" />,
      property: <Building2 className="w-5 h-5 text-purple-400" />,
      message: <MessageSquare className="w-5 h-5 text-orange-400" />,
      reminder: <Clock className="w-5 h-5 text-yellow-400" />,
      favorite: <Heart className="w-5 h-5 text-pink-400" />,
      default: <Info className="w-5 h-5 text-[#A1A1AA]" />
    };
    return icons[type] || icons.default;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Notifications</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Stay updated with your activity</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#F97316] hover:border-[#F97316]/30 transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-[#F97316] text-white'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'unread'
              ? 'bg-[#F97316] text-white'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'read'
              ? 'bg-[#F97316] text-white'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
          }`}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-xl">
          <Bell className="w-12 h-12 text-[#F97316]/30 mx-auto mb-4" />
          <h3 className="text-white font-light mb-2">No notifications</h3>
          <p className="text-[#A1A1AA] text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[#18181B] border border-[#27272A] rounded-xl p-4 hover:border-[#F97316]/30 transition-colors ${
                !notification.read ? 'bg-[#F97316]/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{notification.message}</p>
                      <p className="text-[#A1A1AA] text-xs mt-1">
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-[#A1A1AA] hover:text-[#F97316] transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-[#A1A1AA] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {notification.data && (
                    <div className="mt-3 p-3 bg-[#0A0A0A] rounded-lg">
                      <pre className="text-xs text-[#A1A1AA] whitespace-pre-wrap">
                        {JSON.stringify(notification.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardNotifications;
