import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PwaClient } from "../plugins/pwa/client";

interface Notification {
  id: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      setNotifications(await res.json());
    }
  }

  useEffect(() => {
    fetchNotifications();

    const socket: Socket = io();
    socket.on("notification:new", (data: any) => {
      setToast({ title: data.payload.title, body: data.payload.body });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      fetchNotifications();
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      socket.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Notification sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in transform transition-all duration-300 ease-in-out hover:scale-105">
          <div className="font-bold text-lg mb-1">{toast.title}</div>
          {toast.body && <div className="text-sm opacity-90">{toast.body}</div>}
        </div>
      )}

      {/* Notification Bell Button */}
      <button 
        onClick={() => setOpen(!open)} 
        className="relative focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <svg 
          className="w-6 h-6 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transform -translate-y-1 translate-x-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl border border-gray-200 rounded-xl z-50 transform transition-all duration-200 ease-in-out">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-500">You have {unreadCount} unread notifications</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(n => (
                  <li 
                    key={n.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${n.read ? "bg-gray-50" : "bg-white"}`}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${n.read ? "text-gray-600" : "text-gray-900"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />
                          )}
                        </div>
                        {n.body && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{n.body}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Push notification toggle */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <PwaClient.Toggle />
          </div>
        </div>
      )}
    </div>
  );
};