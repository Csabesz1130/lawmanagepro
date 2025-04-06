import { Calendar, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface SearchResult {
  id: string;
  type: 'matter' | 'document' | 'event' | 'contact';
  title: string;
  description: string;
  timestamp: Date;
  relevance: number;
}

export default function VoiceSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleCommand = async (command: string) => {
    try {
      setSearchQuery(command);
      setIsSearching(true);
      
      // Itt implementálható a keresési logika
      // Példa eredmények:
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'matter',
          title: 'Példa ügy',
          description: 'Ügy leírása...',
          timestamp: new Date(),
          relevance: 0.95,
        },
        {
          id: '2',
          type: 'document',
          title: 'Szerződés',
          description: 'Dokumentum leírása...',
          timestamp: new Date(),
          relevance: 0.85,
        },
      ];

      setResults(mockResults);
      setError(null);
    } catch (error) {
      setError('Hiba történt a keresés során');
      console.error('Keresési hiba:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'matter':
        return <FileText className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'contact':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hangalapú keresés</h2>
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

      {/* Keresési eredmények */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Keresési eredmények</h3>
        <div className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            results.map(result => (
              <Card key={result.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getResultIcon(result.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{result.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • Relevancia: {Math.round(result.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : searchQuery ? (
            <p className="text-muted-foreground text-center py-4">
              Nincsenek találatok
            </p>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Írja be a keresési kifejezést vagy használja a hangfelismerést
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 