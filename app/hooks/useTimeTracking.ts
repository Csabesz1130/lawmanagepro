import { TimeEntry } from '@prisma/client';
import { useEffect, useState } from 'react';

interface UseTimeTrackingProps {
  matterId?: string;
  onTimeEntryCreate?: (entry: TimeEntry) => void;
  onTimeEntryUpdate?: (entry: TimeEntry) => void;
  onTimeEntryDelete?: (entryId: string) => void;
}

export function useTimeTracking({
  matterId,
  onTimeEntryCreate,
  onTimeEntryUpdate,
  onTimeEntryDelete,
}: UseTimeTrackingProps = {}) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, startTime]);

  const startTracking = async () => {
    if (!matterId) return;

    try {
      const response = await fetch('/api/time-tracking/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matterId }),
      });

      if (!response.ok) throw new Error('Nem sikerült elindítani az időkövetést');

      const entry = await response.json();
      setCurrentEntry(entry);
      setStartTime(new Date());
      setIsTracking(true);
      onTimeEntryCreate?.(entry);
    } catch (error) {
      console.error('Hiba az időkövetés indításakor:', error);
    }
  };

  const stopTracking = async () => {
    if (!currentEntry) return;

    try {
      const response = await fetch(`/api/time-tracking/${currentEntry.id}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: elapsedTime,
        }),
      });

      if (!response.ok) throw new Error('Nem sikerült leállítani az időkövetést');

      const updatedEntry = await response.json();
      setCurrentEntry(null);
      setStartTime(null);
      setIsTracking(false);
      setElapsedTime(0);
      onTimeEntryUpdate?.(updatedEntry);
    } catch (error) {
      console.error('Hiba az időkövetés leállításakor:', error);
    }
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const resumeTracking = () => {
    if (startTime) {
      setIsTracking(true);
    }
  };

  const deleteTimeEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/time-tracking/${entryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Nem sikerült törölni az időbejegyzést');

      onTimeEntryDelete?.(entryId);
    } catch (error) {
      console.error('Hiba az időbejegyzés törlésekor:', error);
    }
  };

  return {
    isTracking,
    currentEntry,
    elapsedTime,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    deleteTimeEntry,
  };
} 