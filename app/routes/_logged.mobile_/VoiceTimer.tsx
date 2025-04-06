import { Pause, Play, Stop, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface TimeEntry {
  id: string;
  matterId: string;
  matterName: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  status: 'active' | 'paused' | 'completed';
}

export default function VoiceTimer() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Indíts időzítő az X ügyhez"
      const matterName = command.match(/az\s+([^ü]+)ügy/)?.[1]?.trim();
      
      if (matterName) {
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          matterId: 'temp-id', // Ezt majd a backend-ről kell lekérni
          matterName,
          startTime: new Date(),
          duration: 0,
          status: 'active',
        };

        setTimeEntries(prev => [newEntry, ...prev]);
        setError(null);
      }
    } catch (error) {
      setError('Hiba történt az időzítő indításakor');
      console.error('Időzítő hiba:', error);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const toggleTimer = (entryId: string) => {
    setTimeEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              status: entry.status === 'active' ? 'paused' : 'active',
              endTime: entry.status === 'active' ? new Date() : undefined,
            }
          : entry
      )
    );
  };

  const stopTimer = (entryId: string) => {
    setTimeEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              status: 'completed',
              endTime: new Date(),
              duration:
                entry.duration +
                (entry.endTime
                  ? Math.floor(
                      (new Date().getTime() - entry.endTime.getTime()) / 1000
                    )
                  : 0),
            }
          : entry
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Hangparancsok szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangalapú időzítő</h2>
        <Card className="p-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Timer className="h-6 w-6" />
            <span className="text-2xl font-mono">{formatDuration(currentTime)}</span>
          </div>
          <VoiceCommandProcessor
            onCommand={handleCommand}
            onError={handleError}
            isListening={false}
            onListeningChange={() => {}}
          />
        </Card>
      </section>

      {/* Hibaüzenet */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Időzítők listája */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Aktív időzítők</h3>
        <div className="space-y-4">
          {timeEntries.map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{entry.matterName}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {entry.status === 'active' && (
                    <Button
                      size="icon"
                      onClick={() => toggleTimer(entry.id)}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {entry.status === 'paused' && (
                    <Button
                      size="icon"
                      onClick={() => toggleTimer(entry.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => stopTimer(entry.id)}
                  >
                    <Stop className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium">
                  Időtartam: {formatDuration(entry.duration)}
                </p>
                {entry.status === 'completed' && (
                  <p className="text-sm text-muted-foreground">
                    Befejezve: {entry.endTime?.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </Card>
          ))}

          {timeEntries.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nincsenek aktív időzítők
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 