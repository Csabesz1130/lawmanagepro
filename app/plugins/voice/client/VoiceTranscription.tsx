import { Edit, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { trpc } from '~/utils/trpc';

interface VoiceTranscriptionProps {
  audioBlob: Blob;
  onTranscriptionComplete: (text: string) => void;
  onError: (error: string) => void;
  matterId?: string;
}

export function VoiceTranscription({
  audioBlob,
  onTranscriptionComplete,
  onError,
  matterId,
}: VoiceTranscriptionProps) {
  const [transcription, setTranscription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const transcribeMutation = trpc.voice.transcribe.useMutation({
    onSuccess: (data) => {
      setTranscription(data.text);
      setIsProcessing(false);
      onTranscriptionComplete(data.text);
    },
    onError: (error) => {
      onError(`Átirat hiba: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const saveMutation = trpc.voice.saveTranscription.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      onTranscriptionComplete(transcription);
    },
    onError: (error) => {
      onError(`Mentési hiba: ${error.message}`);
    },
  });

  useEffect(() => {
    const processAudio = async () => {
      if (!audioBlob) return;

      setIsProcessing(true);
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        if (matterId) {
          formData.append('matterId', matterId);
        }

        await transcribeMutation.mutateAsync(formData);
      } catch (error) {
        onError('Hiba történt az audio feldolgozása során');
        setIsProcessing(false);
      }
    };

    processAudio();
  }, [audioBlob, matterId, transcribeMutation, onError]);

  const handleSave = async () => {
    if (!transcription.trim()) return;

    try {
      await saveMutation.mutateAsync({
        text: transcription,
        matterId,
      });
    } catch (error) {
      onError('Hiba történt a mentés során');
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Hangátirat feldolgozása...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hangátirat</h3>
        <div className="space-x-2">
          {isEditing ? (
            <Button onClick={handleSave} disabled={saveMutation.isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Mentés
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Szerkesztés
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        disabled={!isEditing}
        className="min-h-[200px]"
        placeholder="Az átirat itt jelenik meg..."
      />
    </div>
  );
} 