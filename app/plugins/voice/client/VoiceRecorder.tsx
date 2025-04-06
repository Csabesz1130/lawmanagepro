import { Mic, Pause, Play, Square } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onError: (error: string) => void;
  maxDuration?: number; // maximális rögzítési idő másodpercben
}

export function VoiceRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 3600, // alapértelmezett 1 óra
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setIsPaused(false);
        setDuration(0);
      };

      mediaRecorder.start(1000); // 1 másodpercenként menti az adatokat
      setIsRecording(true);
      setIsPaused(false);

      // Időzítő indítása
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      onError('Nem sikerült elindítani a hangrögzítést');
      console.error('Hangrögzítési hiba:', error);
    }
  }, [maxDuration, onRecordingComplete, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    setIsPaused(!isPaused);
  }, [isPaused]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="text-2xl font-mono">{formatDuration(duration)}</div>
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button
            size="lg"
            onClick={startRecording}
            className="rounded-full w-16 h-16"
          >
            <Mic className="h-6 w-6" />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={togglePause}
              className="rounded-full w-16 h-16"
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={stopRecording}
              className="rounded-full w-16 h-16"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 