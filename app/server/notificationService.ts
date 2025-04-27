import { db } from './db';

export async function createNotification(userId: string, title: string, body?: string) {
  return db.query(
    'INSERT INTO notifications (user_id, title, body, read_at) VALUES (?, ?, ?, NULL)',
    [userId, title, body]
  );
}

export async function listNotifications(userId: string, unreadOnly: boolean = false) {
  const query = unreadOnly 
    ? 'SELECT * FROM notifications WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC'
    : 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
  
  return db.query(query, [userId]);
}

export async function markNotificationAsRead(notificationId: string) {
  return db.query(
    'UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ?',
    [notificationId]
  );
}