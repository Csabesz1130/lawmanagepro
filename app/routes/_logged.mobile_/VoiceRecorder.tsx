import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { VoiceRecorder as VoiceRecorderComponent } from '~/plugins/voice/client/VoiceRecorder';
import { VoiceTranscription } from '~/plugins/voice/client/VoiceTranscription';

interface Recording {
  id: string;
  audioBlob: Blob;
  timestamp: Date;
  transcription?: string;
}

export default function VoiceRecorder() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = (audioBlob: Blob) => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      audioBlob,
      timestamp: new Date(),
    };
    setRecordings(prev => [newRecording, ...prev]);
  };

  const handleTranscriptionComplete = (recordingId: string, transcription: string) => {
    setRecordings(prev =>
      prev.map(rec =>
        rec.id === recordingId
          ? { ...rec, transcription }
          : rec
      )
    );
  };

  const handleDeleteRecording = (recordingId: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== recordingId));
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangrögzítési hiba:', error);
  };

  return (
    <div className="space-y-6">
      {/* Hangrögzítő szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangrögzítés</h2>
        <Card className="p-4">
          <VoiceRecorderComponent
            onRecordingComplete={handleRecordingComplete}
            onError={handleError}
            maxDuration={300} // 5 perc maximális hossz
          />
        </Card>
      </section>

      {/* Hibaüzenet */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Rögzítések listája */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Rögzítések</h3>
        <div className="space-y-4">
          {recordings.map(recording => (
            <Card key={recording.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">
                    Rögzítés {recording.timestamp.toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(recording.audioBlob.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRecording(recording.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {!recording.transcription && (
                <div className="flex justify-center py-4">
                  <VoiceTranscription
                    audioBlob={recording.audioBlob}
                    onTranscriptionComplete={(transcription) =>
                      handleTranscriptionComplete(recording.id, transcription)
                    }
                    onError={handleError}
                  />
                </div>
              )}

              {recording.transcription && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Átirat:</p>
                  <p className="text-sm text-muted-foreground">
                    {recording.transcription}
                  </p>
                  <Button
                    className="mt-2"
                    onClick={() => {
                      // Itt implementálható a mentés logikája
                      console.log('Mentés:', recording);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Mentés
                  </Button>
                </div>
              )}
            </Card>
          ))}

          {recordings.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Még nincsenek rögzítések
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 