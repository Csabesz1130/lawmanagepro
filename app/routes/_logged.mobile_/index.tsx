import { Calendar, Clock, FileText, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button, Card } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { VoiceCommandProcessor } from '~/plugins/voice/client/VoiceCommandProcessor';

interface Matter {
  id: string;
  title: string;
  type: string;
  status: string;
  client: string;
  lastActivity: Date;
  nextDeadline?: Date;
}

interface Task {
  id: string;
  title: string;
  matterId: string;
  matterTitle: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export default function MobileHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleCommand = async (command: string) => {
    try {
      // Itt implementálható a parancs feldolgozása
      // Példa: "Keresd meg az X ügyet"
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in_progress':
        return 'text-warning';
      case 'pending':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredMatters = matters.filter(matter =>
    matter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    matter.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.matterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Kereső szekció */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Üdvözöljük!</h2>
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

      {/* Gyors műveletek */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Gyors műveletek</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-24 flex flex-col items-center justify-center space-y-2">
            <Calendar className="h-6 w-6" />
            <span>Naptár</span>
          </Button>
          <Button className="h-24 flex flex-col items-center justify-center space-y-2">
            <FileText className="h-6 w-6" />
            <span>Dokumentumok</span>
          </Button>
          <Button className="h-24 flex flex-col items-center justify-center space-y-2">
            <Users className="h-6 w-6" />
            <span>Kapcsolatok</span>
          </Button>
          <Button className="h-24 flex flex-col items-center justify-center space-y-2">
            <Clock className="h-6 w-6" />
            <span>Időkövetés</span>
          </Button>
        </div>
      </section>

      {/* Teendők */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Teendők</h3>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {task.matterTitle}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span
                      className={`text-sm ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority === 'high'
                        ? 'Magas'
                        : task.priority === 'medium'
                        ? 'Közepes'
                        : 'Alacsony'}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span
                      className={`text-sm ${getStatusColor(task.status)}`}
                    >
                      {task.status === 'completed'
                        ? 'Befejezve'
                        : task.status === 'in_progress'
                        ? 'Folyamatban'
                        : 'Függőben'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery ? 'Nincsenek találatok' : 'Nincsenek teendők'}
            </p>
          )}
        </div>
      </section>

      {/* Ügyek */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ügyek</h3>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredMatters.map(matter => (
            <Card key={matter.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h4 className="font-medium">{matter.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {matter.client}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {matter.type}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {matter.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Utolsó aktivitás: {formatDate(matter.lastActivity)}
                    </span>
                    {matter.nextDeadline && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          Következő határidő: {formatDate(matter.nextDeadline)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredMatters.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery ? 'Nincsenek találatok' : 'Nincsenek ügyek'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 