import { useParams } from '@remix-run/react';
import { useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { useOrganization } from './useOrganization';

interface ActivityData {
  type: string;
  content: string;
  matterId?: string;
  duration: number;
}

export function useActivityTracking() {
  const { organization } = useOrganization();
  const { organizationId } = useParams();

  useEffect(() => {
    if (!organizationId) return;

    let startTime = Date.now();
    let activityTimer: NodeJS.Timeout;

    const trackActivity = async (data: ActivityData) => {
      if (!organizationId) return;

      await trpc.activityApi.create.mutate({
        data: {
          organizationId,
          type: data.type,
          content: data.content,
          matterId: data.matterId,
          duration: data.duration,
          timestamp: new Date(),
        },
      });
    };

    const handleRouteChange = () => {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes

      trackActivity({
        type: 'page_view',
        content: window.location.pathname,
        duration,
      });

      startTime = Date.now();
    };

    const handleEmailView = (emailId: string) => {
      trackActivity({
        type: 'email_view',
        content: emailId,
        duration: 1, // default 1 minute for email viewing
      });
    };

    const handleDocumentEdit = (documentId: string, matterId?: string) => {
      trackActivity({
        type: 'document_edit',
        content: documentId,
        matterId,
        duration: 5, // default 5 minutes for document editing
      });
    };

    const handleCalendarEvent = (eventId: string, matterId?: string) => {
      trackActivity({
        type: 'calendar_event',
        content: eventId,
        matterId,
        duration: 30, // default 30 minutes for calendar events
      });
    };

    // Set up event listeners
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('email_view', (e: CustomEvent) => handleEmailView(e.detail.emailId));
    window.addEventListener('document_edit', (e: CustomEvent) => handleDocumentEdit(e.detail.documentId, e.detail.matterId));
    window.addEventListener('calendar_event', (e: CustomEvent) => handleCalendarEvent(e.detail.eventId, e.detail.matterId));

    // Clean up
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('email_view', (e: CustomEvent) => handleEmailView(e.detail.emailId));
      window.removeEventListener('document_edit', (e: CustomEvent) => handleDocumentEdit(e.detail.documentId, e.detail.matterId));
      window.removeEventListener('calendar_event', (e: CustomEvent) => handleCalendarEvent(e.detail.eventId, e.detail.matterId));
      clearTimeout(activityTimer);
    };
  }, [organizationId]);
} 