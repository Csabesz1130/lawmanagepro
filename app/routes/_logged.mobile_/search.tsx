import { Calendar, Clock, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface SearchResult {
  id: string;
  type: 'matter' | 'document' | 'contact' | 'event';
  title: string;
  description?: string;
  matterId?: string;
  matterTitle?: string;
  date?: Date;
  relevance: number;
}

export default function MobileSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCommand = async (command: string) => {
    try {
      setIsSearching(true);
      // Itt implementálható a parancs feldolgozása
      // Példa: "Keresd meg az X ügyet"
      console.log('Parancs feldolgozása:', command);
      setError(null);
    } catch (error) {
      setError('Hiba történt a parancs feldolgozása során');
      console.error('Parancs feldolgozási hiba:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'matter':
        return <FileText className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'contact':
        return <Users className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']): string => {
    switch (type) {
      case 'matter':
        return 'Ügy';
      case 'document':
        return 'Dokumentum';
      case 'contact':
        return 'Kapcsolat';
      case 'event':
        return 'Esemény';
      default:
        return '';
    }
  };

  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.matterTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Keresés</h2>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Eredmények</h3>
          {isSearching && (
            <div className="text-sm text-muted-foreground">Keresés...</div>
          )}
        </div>
        <div className="space-y-4">
          {filteredResults.map(result => (
            <Card key={result.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getResultIcon(result.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{result.title}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {getResultTypeLabel(result.type)}
                    </span>
                  </div>
                  {result.matterTitle && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {result.matterTitle}
                      </span>
                    </div>
                  )}
                  {result.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.description}
                    </p>
                  )}
                  {result.date && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(result.date)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${result.relevance * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(result.relevance * 100)}% relevancia
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {!isSearching && filteredResults.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery ? 'Nincsenek találatok' : 'Kezdjen el keresni'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 