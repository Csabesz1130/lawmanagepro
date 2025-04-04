import { Matter } from '@prisma/client';
import { Button, Card, Form, Input, Modal, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useOrganization } from '~/hooks/useOrganization';
import { useTimeTracking } from '~/hooks/useTimeTracking';
import { useAIService } from '~/plugins/ai/hooks/useAIService';

interface TimeSuggestion {
  id: string;
  matterId: string;
  matterName: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  confidence: number;
  activities: string[];
}

export function SmartTimeTracker() {
  const [suggestions, setSuggestions] = useState<TimeSuggestion[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<TimeSuggestion | null>(null);
  const [form] = Form.useForm();
  const { organization } = useOrganization();
  const { getTimeSuggestions, saveTimeEntry } = useAIService();
  const { matters } = useTimeTracking();

  useEffect(() => {
    if (isEnabled && organization?.id) {
      const fetchSuggestions = async () => {
        const data = await getTimeSuggestions(organization.id);
        setSuggestions(data);
      };
      fetchSuggestions();
      const interval = setInterval(fetchSuggestions, 15 * 60 * 1000); // 15 minutes
      return () => clearInterval(interval);
    }
  }, [isEnabled, organization?.id]);

  const handleAcceptSuggestion = async (suggestion: TimeSuggestion) => {
    setSelectedSuggestion(suggestion);
    form.setFieldsValue({
      matterId: suggestion.matterId,
      startTime: dayjs(suggestion.startTime),
      endTime: dayjs(suggestion.endTime),
      description: suggestion.description,
    });
    setIsModalVisible(true);
  };

  const handleSaveTimeEntry = async (values: any) => {
    if (selectedSuggestion) {
      await saveTimeEntry({
        ...values,
        organizationId: organization?.id,
        activities: selectedSuggestion.activities,
      });
      setSuggestions(suggestions.filter(s => s.id !== selectedSuggestion.id));
      setIsModalVisible(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Okos Időkövetési Javaslatok</h2>
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          checkedChildren="Bekapcsolva"
          unCheckedChildren="Kikapcsolva"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map(suggestion => (
          <Card
            key={suggestion.id}
            title={suggestion.matterName}
            extra={
              <div className="flex space-x-2">
                <Button type="primary" onClick={() => handleAcceptSuggestion(suggestion)}>
                  Elfogadás
                </Button>
                <Button danger onClick={() => setSuggestions(suggestions.filter(s => s.id !== suggestion.id))}>
                  Elutasítás
                </Button>
              </div>
            }
          >
            <p className="text-gray-600">{suggestion.description}</p>
            <p className="text-sm text-gray-500">
              Időtartam: {Math.round(suggestion.duration / 60)} perc
            </p>
            <p className="text-sm text-gray-500">
              Biztonság: {Math.round(suggestion.confidence * 100)}%
            </p>
          </Card>
        ))}
      </div>

      <Modal
        title="Időbejegyzés szerkesztése"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSaveTimeEntry} layout="vertical">
          <Form.Item
            name="matterId"
            label="Ügy"
            rules={[{ required: true, message: 'Kérjük válasszon ügyet' }]}
          >
            <Select>
              {matters?.map((matter: Matter) => (
                <Select.Option key={matter.id} value={matter.id}>
                  {matter.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Kezdés"
            rules={[{ required: true, message: 'Kérjük adja meg a kezdési időt' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Befejezés"
            rules={[{ required: true, message: 'Kérjük adja meg a befejezési időt' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Leírás"
            rules={[{ required: true, message: 'Kérjük adja meg a leírást' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 