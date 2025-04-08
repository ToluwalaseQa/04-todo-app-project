'use client';

import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useTodos } from '@/hooks/useTodos';
import { format } from 'date-fns';

interface Notification {
  id: string;
  message: string;
  taskId: string;
  timestamp: Date;
  read: boolean;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { tasks } = useTodos();

  useEffect(() => {
    // Check for due tasks
    const dueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) <= new Date() &&
        task.status !== 'completed'
    );

    const newNotifications = dueTasks.map((task) => ({
      id: `due-${task.id}`,
      message: `Task "${task.title}" is due!`,
      taskId: task.id,
      timestamp: new Date(),
      read: false,
    }));

    setNotifications((prev) => [
      ...newNotifications.filter(
        (n) => !prev.some((p) => p.id === n.id && p.read)
      ),
      ...prev.filter((p) => !newNotifications.some((n) => n.id === p.id)),
    ]);
  }, [tasks]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 rounded-full relative'
      >
        <BellIcon className='h-5 w-5' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 dark:bg-gray-800'>
          <div className='p-2 border-b dark:border-gray-700'>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Notifications</h3>
              <button
                onClick={markAllAsRead}
                className='text-sm text-blue-500 hover:underline'
              >
                Mark all as read
              </button>
            </div>
          </div>
          <div className='max-h-64 overflow-y-auto'>
            {notifications.length === 0 ? (
              <div className='p-4 text-center text-gray-500'>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className='text-sm'>{notification.message}</div>
                  <div className='text-xs text-gray-500 mt-1'>
                    {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
