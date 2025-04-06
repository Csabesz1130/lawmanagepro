import { Calendar, Clock, Pause, Play, Stop } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface TimeEntry {
  id: string;
  matterId: string;
  matterTitle: string;
  startTime: Date;
  endTime?: Date;
  description?: string;
  status: 'active' | 'paused' | 'completed';
}

export default function MobileTimer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeEntry && activeEntry.status === 'active') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeEntry]);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Indíts időzítőt az X ügyhez"
      console.log('Parancs feldolgozása:', command);
      setError(null);
    } catch (error) {
      setError('Hiba történt a parancs feldolgozása során');
      console.error('Parancs feldolgozási hiba:', error);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const startTimer = (matterId: string, matterTitle: string) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      matterId,
      matterTitle,
      startTime: new Date(),
      status: 'active',
    };

    setActiveEntry(newEntry);
    setTimeEntries(prev => [newEntry, ...prev]);
  };

  const pauseTimer = () => {
    if (activeEntry) {
      setActiveEntry(prev => ({
        ...prev!,
        status: 'paused',
      }));
    }
  };

  const resumeTimer = () => {
    if (activeEntry) {
      setActiveEntry(prev => ({
        ...prev!,
        status: 'active',
      }));
    }
  };

  const stopTimer = () => {
    if (activeEntry) {
      const updatedEntry: TimeEntry = {
        ...activeEntry,
        endTime: new Date(),
        status: 'completed',
      };

      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === activeEntry.id ? updatedEntry : entry
        )
      );
      setActiveEntry(null);
      setElapsedTime(0);
    }
  };

  const filteredEntries = timeEntries.filter(entry =>
    entry.matterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Aktív időzítő */}
      {activeEntry && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{activeEntry.matterTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(activeEntry.startTime)}
              </p>
            </div>
            <div className="text-2xl font-mono">
              {formatDuration(elapsedTime)}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            {activeEntry.status === 'active' ? (
              <Button
                variant="outline"
                size="icon"
                onClick={pauseTimer}
                className="h-12 w-12"
              >
                <Pause className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={resumeTimer}
                className="h-12 w-12"
              >
                <Play className="h-6 w-6" />
              </Button>
            )}
            <Button
              variant="destructive"
              size="icon"
              onClick={stopTimer}
              className="h-12 w-12"
            >
              <Stop className="h-6 w-6" />
            </Button>
          </div>
        </Card>
      )}

      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Időkövetés</h2>
        <Card className="p-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Keresés szöveggel vagy hanggal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <VoiceCommandProcessor
              onCommand={handleCommand}
              onError={handleError}
              isListening={false}
              onListeningChange={() => {}}
            />
          </div>
        </Card>
      </section>

      {/* Hibaüzenet */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Időbejegyzések */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Időbejegyzések</h3>
          <Button size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h4 className="font-medium">{entry.matterTitle}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.startTime)}
                    </span>
                    {entry.endTime && (
                      <>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(entry.endTime)}
                        </span>
                      </>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {entry.description}
                    </p>
                  )}
                </div>
                {entry.status === 'completed' && entry.endTime && (
                  <div className="text-sm font-mono">
                    {formatDuration(
                      Math.floor(
                        (entry.endTime.getTime() - entry.startTime.getTime()) /
                          1000
                      )
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}

          {filteredEntries.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery ? 'Nincsenek találatok' : 'Nincsenek időbejegyzések'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 