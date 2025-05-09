import { PwaService } from '../plugins/pwa/server/pwa.service';
import { SocketBase } from '../plugins/socket/base';
import { db } from './db';

export async function createNotification(userId: string, title: string, body?: string) {
  const result = await db.query(
    'INSERT INTO notifications (user_id, title, body, read_at) VALUES (?, ?, ?, NULL)',
    [userId, title, body]
  );

  // Emit real-time notification event
  SocketBase.service.emit('notification:new', { title, body }, [userId]);

  // Send push notification
  const pwaSubscriptions = await db.query('SELECT content FROM pwa_subscriptions WHERE user_id = ?', [userId]);
  if (pwaSubscriptions.length > 0) {
    const subscriptions = pwaSubscriptions.map(sub => JSON.parse(sub.content));
    PwaService.sendNotifications(subscriptions, title, body || '');
  }

  return result;
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