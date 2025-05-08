import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

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

  async function fetchNotifications() {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      setNotifications(await res.json());
    }
  }

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll every 30 seconds:
    // const interval = setInterval(fetchNotifications, 30000);
    // return () => clearInterval(interval);

    // --- Socket.IO real-time notifications ---
    const socket: Socket = io();
    socket.on("notification:new", (data: any) => {
      setToast({ title: data.payload.title, body: data.payload.body });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      fetchNotifications();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Hide toast after 4 seconds
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
    <div className="relative inline-block">
      {/* Notification sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
          <div className="font-bold">{toast.title}</div>
          {toast.body && <div className="text-sm">{toast.body}</div>}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          {/* Bell Icon SVG */}
          <path d="M..." />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
          <div className="p-2 font-bold border-b">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications.</div>
          ) : (
            <ul>
              {notifications.map(n => (
                <li key={n.id} className={`p-2 border-b last:border-none cursor-pointer ${n.read ? "bg-gray-100" : "bg-white"}`}
                  onClick={() => !n.read && markAsRead(n.id)}>
                  <div className="font-semibold">{n.title}</div>
                  {n.body && <div className="text-sm">{n.body}</div>}
                  <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                  {!n.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};