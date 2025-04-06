import { Mic, MicOff } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';

interface VoiceCommandProcessorProps {
  onCommand: (command: string) => void;
  onError: (error: string) => void;
  isListening: boolean;
  onListeningChange: (isListening: boolean) => void;
}

export function VoiceCommandProcessor({
  onCommand,
  onError,
  isListening,
  onListeningChange,
}: VoiceCommandProcessorProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

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
          onCommand(transcript);
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
  }, [onCommand, onError, isListening]);

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
    onListeningChange(!isListening);
  }, [recognition, isListening, onListeningChange, onError]);

  return (
    <div className="flex items-center justify-center p-4">
      <Button
        variant={isListening ? "destructive" : "default"}
        size="lg"
        onClick={toggleListening}
        className="rounded-full w-16 h-16"
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
} 