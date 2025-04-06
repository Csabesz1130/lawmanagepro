import { Clock, Edit, Mic, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';
import { VoiceRecorder } from '~/plugins/voice/client/VoiceRecorder';
import { VoiceTranscription } from '~/plugins/voice/client/VoiceTranscription';

interface Note {
  id: string;
  title: string;
  content: string;
  matterId?: string;
  matterTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  audioUrl?: string;
  transcription?: string;
}

export default function MobileNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Hozz létre új jegyzetet az X ügyben"
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

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setIsRecording(false);
  };

  const handleTranscriptionComplete = (transcription: string) => {
    if (selectedNote) {
      setSelectedNote(prev => ({
        ...prev!,
        transcription,
      }));
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Új jegyzet',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
      setNotes(prev =>
        prev.map(note =>
          note.id === selectedNote.id
            ? { ...selectedNote, updatedAt: new Date() }
            : note
        )
      );
      setIsEditing(false);
    }
  };

  const deleteNote = () => {
    if (selectedNote) {
      setNotes(prev => prev.filter(note => note.id !== selectedNote.id));
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.matterTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Jegyzetek</h2>
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

      {/* Jegyzet szerkesztő */}
      {selectedNote && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Input
              value={selectedNote.title}
              onChange={(e) =>
                setSelectedNote(prev => ({
                  ...prev!,
                  title: e.target.value,
                }))
              }
              placeholder="Cím"
              className="text-lg font-semibold"
            />
            <div className="flex space-x-2">
              {isEditing ? (
                <Button size="icon" onClick={saveNote}>
                  <Save className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="destructive" onClick={deleteNote}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isRecording ? (
            <div className="space-y-4">
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                onError={handleError}
                maxDuration={300} // 5 perc
              />
            </div>
          ) : audioBlob ? (
            <div className="space-y-4">
              <VoiceTranscription
                audioBlob={audioBlob}
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleError}
                matterId={selectedNote.matterId}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={selectedNote.content}
                onChange={(e) =>
                  setSelectedNote(prev => ({
                    ...prev!,
                    content: e.target.value,
                  }))
                }
                placeholder="Jegyzet tartalma..."
                className="min-h-[200px]"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsRecording(true)}
              >
                <Mic className="h-4 w-4 mr-2" />
                Hangrögzítés indítása
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Utolsó módosítás: {formatDate(selectedNote.updatedAt)}</span>
          </div>
        </Card>
      )}

      {/* Jegyzetek listája */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Összes jegyzet</h3>
          <Button size="icon" onClick={createNewNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredNotes.map(note => (
            <Card
              key={note.id}
              className="p-4 cursor-pointer hover:bg-accent"
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
                setAudioBlob(null);
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h4 className="font-medium">{note.title}</h4>
                  {note.matterTitle && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {note.matterTitle}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredNotes.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery ? 'Nincsenek találatok' : 'Nincsenek jegyzetek'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 