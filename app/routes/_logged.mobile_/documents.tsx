import { Clock, FileText, Folder, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface Document {
  id: string;
  title: string;
  type: 'document' | 'folder';
  matterId: string;
  matterName: string;
  createdAt: Date;
  updatedAt: Date;
  size?: number;
  author?: string;
  tags?: string[];
}

export default function MobileDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Hozz létre új dokumentumot az X ügyben"
      const newDocument: Document = {
        id: Date.now().toString(),
        title: 'Példa dokumentum',
        type: 'document',
        matterId: 'temp-id',
        matterName: 'Példa ügy',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setDocuments(prev => [newDocument, ...prev]);
      setError(null);
    } catch (error) {
      setError('Hiba történt a dokumentum létrehozása során');
      console.error('Dokumentum létrehozási hiba:', error);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.matterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Navigációs útvonal */}
      <section>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={() => setCurrentPath([])}
            className="hover:text-foreground"
          >
            Dokumentumok
          </button>
          {currentPath.map((folder, index) => (
            <div key={folder} className="flex items-center">
              <span className="mx-2">/</span>
              <button
                onClick={() =>
                  setCurrentPath(prev => prev.slice(0, index + 1))
                }
                className="hover:text-foreground"
              >
                {folder}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dokumentumok</h2>
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

      {/* Dokumentumok listája */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {currentPath.length > 0
              ? currentPath[currentPath.length - 1]
              : 'Összes dokumentum'}
          </h3>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {doc.type === 'folder' ? (
                    <Folder className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{doc.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {doc.matterName}
                    </span>
                    {doc.author && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {doc.author}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(doc.updatedAt)}
                    </span>
                    {doc.size && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(doc.size)}
                        </span>
                      </>
                    )}
                  </div>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredDocuments.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery
                ? 'Nincsenek találatok'
                : 'Még nincsenek dokumentumok'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 