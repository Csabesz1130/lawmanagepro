import { Calendar, Clock, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { Card } from '~/components/ui/card';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface VoiceCommand {
  id: string;
  category: string;
  command: string;
  description: string;
  example: string;
  icon: any;
}

const voiceCommands: VoiceCommand[] = [
  {
    id: 'start-timer',
    category: 'Időkövetés',
    command: 'Indíts időzítőt az [ügy] ügyhez',
    description: 'Elindít egy új időzítőt a megadott ügyhez',
    example: 'Indíts időzítőt a Smith ügyhez',
    icon: Clock,
  },
  {
    id: 'stop-timer',
    category: 'Időkövetés',
    command: 'Állítsd le az időzítőt',
    description: 'Leállítja az aktív időzítőt',
    example: 'Állítsd le az időzítőt',
    icon: Clock,
  },
  {
    id: 'create-note',
    category: 'Jegyzetek',
    command: 'Hozz létre új jegyzetet az [ügy] ügyben',
    description: 'Létrehoz egy új jegyzetet a megadott ügyben',
    example: 'Hozz létre új jegyzetet a Johnson ügyben',
    icon: FileText,
  },
  {
    id: 'search-matter',
    category: 'Keresés',
    command: 'Keresd meg az [ügy] ügyet',
    description: 'Keres egy ügyet a megadott kifejezés alapján',
    example: 'Keresd meg a Brown ügyet',
    icon: FileText,
  },
  {
    id: 'search-contact',
    category: 'Keresés',
    command: 'Keresd meg a [kapcsolat] kapcsolatot',
    description: 'Keres egy kapcsolatot a megadott kifejezés alapján',
    example: 'Keresd meg a Kovács János kapcsolatot',
    icon: Users,
  },
  {
    id: 'create-event',
    category: 'Naptár',
    command: 'Hozz létre új eseményt az [ügy] ügyben',
    description: 'Létrehoz egy új eseményt a megadott ügyben',
    example: 'Hozz létre új eseményt a Wilson ügyben',
    icon: Calendar,
  },
];

export default function MobileVoiceCommands() {
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const handleCommand = async (command: string) => {
    try {
      setLastCommand(command);
      // Itt implementálható a parancs feldolgozása
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

  const categories = Array.from(new Set(voiceCommands.map(cmd => cmd.category)));

  return (
    <div className="space-y-6">
      {/* Hangparancsok bevezetése */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangparancsok</h2>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">
                Használja a hangparancsokat a LawManage Pro vezérléséhez
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Koppintson a mikrofon ikonra a hangfelismerés indításához
              </p>
            </div>
            <VoiceCommandProcessor
              onCommand={handleCommand}
              onError={handleError}
              isListening={isListening}
              onListeningChange={setIsListening}
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

      {/* Utolsó parancs */}
      {lastCommand && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Utolsó parancs</h3>
          <p className="text-muted-foreground">{lastCommand}</p>
        </Card>
      )}

      {/* Parancsok kategóriánként */}
      {categories.map(category => (
        <section key={category}>
          <h3 className="text-lg font-semibold mb-4">{category}</h3>
          <div className="space-y-4">
            {voiceCommands
              .filter(cmd => cmd.category === category)
              .map(cmd => (
                <Card key={cmd.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <cmd.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{cmd.command}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cmd.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Példa: {cmd.example}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
} 