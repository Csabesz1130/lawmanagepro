import { Outlet, useNavigate } from '@remix-run/react';
import {
    Calendar,
    FileText,
    Home,
    Settings,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { VoiceNavigation } from '~/plugins/voice/client/VoiceNavigation';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/mobile/${tab}`);
  };

  const handleVoiceError = (error: string) => {
    console.error('Hangnavigációs hiba:', error);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fejléc */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">LawManage Pro</span>
            </a>
          </div>
        </div>
      </header>

      {/* Fő tartalom */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Navigációs sáv */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="container flex h-16 items-center justify-around">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleTabChange('home')}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === 'calendar' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleTabChange('calendar')}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleTabChange('documents')}
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleTabChange('contacts')}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleTabChange('settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Hangnavigáció */}
      <div className="fixed bottom-20 right-4 z-50">
        <VoiceNavigation onError={handleVoiceError} />
      </div>
    </div>
  );
} 