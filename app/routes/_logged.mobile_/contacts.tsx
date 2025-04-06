import { Building2, Mail, Phone, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface Contact {
  id: string;
  name: string;
  type: 'client' | 'colleague' | 'partner' | 'other';
  email?: string;
  phone?: string;
  organization?: string;
  notes?: string;
}

export default function MobileContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Hozz létre új kapcsolatot X néven"
      const newContact: Contact = {
        id: Date.now().toString(),
        name: 'Példa kapcsolat',
        type: 'client',
      };

      setContacts(prev => [newContact, ...prev]);
      setError(null);
    } catch (error) {
      setError('Hiba történt a kapcsolat létrehozása során');
      console.error('Kapcsolat létrehozási hiba:', error);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Hangfelismerési hiba:', error);
  };

  const getContactIcon = (type: Contact['type']) => {
    switch (type) {
      case 'client':
        return <User className="h-4 w-4" />;
      case 'colleague':
        return <User className="h-4 w-4" />;
      case 'partner':
        return <Building2 className="h-4 w-4" />;
      case 'other':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getContactTypeLabel = (type: Contact['type']) => {
    switch (type) {
      case 'client':
        return 'Ügyfél';
      case 'colleague':
        return 'Kolléga';
      case 'partner':
        return 'Partner';
      case 'other':
        return 'Egyéb';
      default:
        return '';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery) ||
    contact.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Kapcsolatok</h2>
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

      {/* Kapcsolatok listája */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Összes kapcsolat</h3>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredContacts.map(contact => (
            <Card key={contact.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getContactIcon(contact.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{contact.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {getContactTypeLabel(contact.type)}
                    </span>
                  </div>
                  {contact.organization && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {contact.organization}
                      </span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {contact.email}
                      </span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {contact.phone}
                      </span>
                    </div>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredContacts.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery
                ? 'Nincsenek találatok'
                : 'Még nincsenek kapcsolatok'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 