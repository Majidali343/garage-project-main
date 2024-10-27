import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPopover = ({ notifications, onClose, onClear }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button onClick={onClear} className="text-gray-500 hover:text-gray-700">
          Clear All
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="p-4 border-b hover:bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => onClose(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopover;