import { Request, Response } from "express";
import { listNotifications, markNotificationAsRead } from "../notificationService";

// GET /api/notifications?unreadOnly=1
export async function getNotifications(req: Request, res: Response) {
  const userId = req.user?.id; // assume user is attached to req, as in authenticated routes
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const unreadOnly = Boolean(req.query.unreadOnly);
  const notifications = await listNotifications(userId, unreadOnly);
  res.json(notifications);
}

// POST /api/notifications/:id/read
export async function postMarkAsRead(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const { id } = req.params;
  await markNotificationAsRead(id);
  res.json({ success: true });
}