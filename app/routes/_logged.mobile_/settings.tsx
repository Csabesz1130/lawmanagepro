import { Bell, Globe, Mic, Moon, Shield, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';

interface Settings {
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
  voiceSensitivity: number;
  privacyMode: boolean;
}

export default function MobileSettings() {
  const [settings, setSettings] = useState<Settings>({
    voiceEnabled: true,
    notificationsEnabled: true,
    language: 'hu',
    theme: 'system',
    voiceSensitivity: 0.7,
    privacyMode: false,
  });

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Beállítások</h2>

      {/* Hangalapú parancsok */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Hangalapú parancsok</h3>
          </div>
          <Switch
            checked={settings.voiceEnabled}
            onCheckedChange={(checked) =>
              handleSettingChange('voiceEnabled', checked)
            }
          />
        </div>
        {settings.voiceEnabled && (
          <div className="space-y-4">
            <div>
              <Label>Hangfelismerés érzékenysége</Label>
              <Slider
                value={[settings.voiceSensitivity * 100]}
                onValueChange={([value]) =>
                  handleSettingChange('voiceSensitivity', value / 100)
                }
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Adatvédelem mód</Label>
              <Switch
                checked={settings.privacyMode}
                onCheckedChange={(checked) =>
                  handleSettingChange('privacyMode', checked)
                }
              />
            </div>
          </div>
        )}
      </Card>

      {/* Értesítések */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Értesítések</h3>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(checked) =>
              handleSettingChange('notificationsEnabled', checked)
            }
          />
        </div>
      </Card>

      {/* Nyelv */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Nyelv</h3>
        </div>
        <div className="space-y-2">
          <Button
            variant={settings.language === 'hu' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleSettingChange('language', 'hu')}
          >
            Magyar
          </Button>
          <Button
            variant={settings.language === 'en' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleSettingChange('language', 'en')}
          >
            English
          </Button>
        </div>
      </Card>

      {/* Téma */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          {settings.theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <h3 className="text-lg font-semibold">Téma</h3>
        </div>
        <div className="space-y-2">
          <Button
            variant={settings.theme === 'light' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleSettingChange('theme', 'light')}
          >
            Világos
          </Button>
          <Button
            variant={settings.theme === 'dark' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleSettingChange('theme', 'dark')}
          >
            Sötét
          </Button>
          <Button
            variant={settings.theme === 'system' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleSettingChange('theme', 'system')}
          >
            Rendszer alapértelmezett
          </Button>
        </div>
      </Card>

      {/* Adatvédelem */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Adatvédelem</h3>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Adatvédelmi beállítások
          </Button>
          <Button variant="outline" className="w-full">
            Adatok exportálása
          </Button>
          <Button variant="outline" className="w-full">
            Adatok törlése
          </Button>
        </div>
      </Card>
    </div>
  );
} 