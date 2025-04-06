import { CheckSquare, FileText, Search, Timer } from 'lucide-react';
import { useState } from 'react';
import { Card } from '~/components/ui/card';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface CommandHistory {
  command: string;
  timestamp: Date;
  success: boolean;
  message: string;
}

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      const result = {
        command,
        timestamp: new Date(),
        success: true,
        message: 'Parancs sikeresen feldolgozva',
      };

      setCommandHistory(prev => [result, ...prev].slice(0, 10));
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

  return (
    <div className="space-y-6">
      {/* Hangparancsok szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangparancsok</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5" />
              <span>Időzítő</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              "Indíts időzítő az X ügyhez"
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5" />
              <span>Feladat</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              "Hozz létre feladatot az X ügyhez"
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Keresés</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              "Keresés az X ügyben"
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Jegyzet</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              "Jegyzetelj X az Y ügyhez"
            </p>
          </Card>
        </div>
      </section>

      {/* Hangfelismerés vezérlő */}
      <section className="flex justify-center">
        <VoiceCommandProcessor
          onCommand={handleCommand}
          onError={handleError}
          isListening={isListening}
          onListeningChange={setIsListening}
        />
      </section>

      {/* Hibaüzenet */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Parancs előzmények */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Parancs előzmények</h3>
        <div className="space-y-2">
          {commandHistory.map((cmd, index) => (
            <Card key={index} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{cmd.command}</p>
                  <p className="text-sm text-muted-foreground">
                    {cmd.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`text-sm ${
                    cmd.success ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {cmd.success ? '✓' : '✗'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {cmd.message}
              </p>
            </Card>
          ))}
          {commandHistory.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Még nincsenek parancs előzmények
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 