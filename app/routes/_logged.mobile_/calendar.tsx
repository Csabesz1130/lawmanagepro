import { Calendar, Clock, MapPin, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  type: 'meeting' | 'deadline' | 'reminder';
}

export default function MobileCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Hozz létre találkozót holnap 10:00-kor az X ügyben"
      const newEvent: Event = {
        id: Date.now().toString(),
        title: 'Példa találkozó',
        description: 'Találkozó leírása...',
        startTime: new Date(),
        endTime: new Date(),
        type: 'meeting',
      };

      setEvents(prev => [newEvent, ...prev]);
      setError(null);
    } catch (error) {
      setError('Hiba történt az esemény létrehozása során');
      console.error('Esemény létrehozási hiba:', error);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Naptár fejléc */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Naptár</h2>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {formatDate(selectedDate)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString('hu-HU', { weekday: 'long' })}
              </p>
            </div>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
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

      {/* Események listája */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Események</h3>
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.location}
                      </span>
                    </div>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.attendees.length} résztvevő
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {events.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Nincsenek események ezen a napon
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 