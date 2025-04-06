import { FileText, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import { VoiceRecorder as VoiceRecorderComponent } from '~/plugins/voice/client/VoiceRecorder';
import { VoiceTranscription } from '~/plugins/voice/client/VoiceTranscription';

interface Note {
  id: string;
  matterId: string;
  matterName: string;
  content: string;
  audioUrl?: string;
  timestamp: Date;
  status: 'draft' | 'saved';
}

export default function VoiceNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Itt implementálható az audio blob feldolgozása és mentése
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const newNote: Note = {
        id: Date.now().toString(),
        matterId: 'temp-id', // Ezt majd a backend-ről kell lekérni
        matterName: 'Példa ügy', // Ezt majd a backend-ről kell lekérni
        content: '',
        audioUrl,
        timestamp: new Date(),
        status: 'draft',
      };

      setNotes(prev => [newNote, ...prev]);
      setError(null);
    } catch (error) {
      setError('Hiba történt a hangrögzítés során');
      console.error('Hangrögzítési hiba:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscriptionComplete = (noteId: string, transcription: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, content: transcription }
          : note
      )
    );
  };

  const handleSave = async (noteId: string) => {
    try {
      setIsProcessing(true);
      
      // Itt implementálható a jegyzet mentése a backend-re
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId
            ? { ...note, status: 'saved' }
            : note
        )
      );
      
      setError(null);
    } catch (error) {
      setError('Hiba történt a jegyzet mentése során');
      console.error('Mentési hiba:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hiba:', error);
  };

  return (
    <div className="space-y-6">
      {/* Hangrögzítő szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangalapú jegyzetelés</h2>
        <Card className="p-4">
          <VoiceRecorderComponent
            onRecordingComplete={handleRecordingComplete}
            onError={handleError}
            maxDuration={600} // 10 perc maximális hossz
          />
        </Card>
      </section>

      {/* Hibaüzenet */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Jegyzetek listája */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Jegyzetek</h3>
        <div className="space-y-4">
          {notes.map(note => (
            <Card key={note.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{note.matterName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {note.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {note.status === 'draft' && (
                    <Button
                      size="icon"
                      onClick={() => handleSave(note.id)}
                      disabled={isProcessing}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {note.audioUrl && (
                <div className="mb-4">
                  <audio
                    controls
                    src={note.audioUrl}
                    className="w-full"
                  />
                </div>
              )}

              {!note.content && (
                <div className="flex justify-center py-4">
                  <VoiceTranscription
                    audioBlob={new Blob([note.audioUrl || ''])}
                    onTranscriptionComplete={(transcription) =>
                      handleTranscriptionComplete(note.id, transcription)
                    }
                    onError={handleError}
                  />
                </div>
              )}

              {note.content && (
                <div className="mt-4">
                  <Textarea
                    value={note.content}
                    onChange={(e) =>
                      handleTranscriptionComplete(note.id, e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </Card>
          ))}

          {notes.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Még nincsenek jegyzetek
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 