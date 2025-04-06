import { useNavigate } from '@remix-run/react';
import { Mic, MicOff, Navigation } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';

interface VoiceNavigationProps {
  onError: (error: string) => void;
}

interface NavigationCommand {
  action: string;
  target: string;
  params?: Record<string, string>;
}

export function VoiceNavigation({ onError }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  const processCommand = useCallback((command: string) => {
    try {
      // Példa parancsok:
      // "Menj a Johnson ügyhez"
      // "Nyisd meg a naptárat"
      // "Keresés a precedensek között"
      
      const commandMap: Record<string, NavigationCommand> = {
        'ügy': { action: 'navigate', target: '/matters' },
        'naptár': { action: 'navigate', target: '/calendar' },
        'keresés': { action: 'navigate', target: '/search' },
        'precedens': { action: 'navigate', target: '/precedents' },
        'dokumentum': { action: 'navigate', target: '/documents' },
        'feladat': { action: 'navigate', target: '/tasks' },
      };

      // Parancs feldolgozása
      const words = command.toLowerCase().split(' ');
      let matchedCommand: NavigationCommand | null = null;

      for (const [key, value] of Object.entries(commandMap)) {
        if (words.includes(key)) {
          matchedCommand = value;
          break;
        }
      }

      if (matchedCommand) {
        switch (matchedCommand.action) {
          case 'navigate':
            navigate(matchedCommand.target);
            break;
          default:
            onError('Ismeretlen parancs');
        }
      } else {
        onError('Nem értettem a parancsot. Kérlek, próbáld újra.');
      }
    } catch (error) {
      onError('Hiba történt a parancs feldolgozása során');
    }
  }, [navigate, onError]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hu-HU';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (event.results[0].isFinal) {
          processCommand(transcript);
        }
      };

      recognition.onerror = (event) => {
        onError(`Hangfelismerési hiba: ${event.error}`);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      setRecognition(recognition);
    }
  }, [isListening, processCommand, onError]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      onError('A hangfelismerés nem támogatott ezen a böngészőn');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  }, [recognition, isListening, onError]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant={isListening ? "destructive" : "default"}
        size="lg"
        onClick={toggleListening}
        className="rounded-full w-16 h-16 shadow-lg"
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-background border rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span className="text-sm">Hangalapú navigáció aktív</span>
          </div>
        </div>
      )}
    </div>
  );
} 