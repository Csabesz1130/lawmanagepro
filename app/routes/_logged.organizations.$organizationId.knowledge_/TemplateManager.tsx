import { useParams } from '@remix-run/react';
import { useState } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { trpc } from '~/utils/trpc';

interface Template {
  id: string;
  title: string;
  content: string;
  guidance: string;
  practiceAreaId: string;
  documentType: string;
  status: 'draft' | 'review' | 'approved';
  usageCount: number;
  successRate: number | null;
  createdAt: string;
  updatedAt: string;
}

export function TemplateManager() {
  const { organizationId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Template>>({});

  const practiceAreas = trpc.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const templates = trpc.templates.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const selectedTemplateData = trpc.templates.get.useQuery(
    { id: selectedTemplate! },
    { enabled: !!selectedTemplate }
  );

  const createTemplate = trpc.templates.create.useMutation();
  const updateTemplate = trpc.templates.update.useMutation();

  const handleSave = async () => {
    if (selectedTemplate) {
      await updateTemplate.mutateAsync({
        id: selectedTemplate,
        ...editData,
      });
    } else {
      await createTemplate.mutateAsync({
        organizationId: organizationId!,
        ...editData,
      });
    }
    setIsEditing(false);
    setEditData({});
  };

  const getStatusColor = (status: Template['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'review':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Szakterület" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden szakterület</SelectItem>
              {practiceAreas.data?.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Dokumentum típus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden típus</SelectItem>
              <SelectItem value="contract">Szerződés</SelectItem>
              <SelectItem value="motion">Beadvány</SelectItem>
              <SelectItem value="opinion">Jogi vélemény</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Státusz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden státusz</SelectItem>
              <SelectItem value="draft">Vázlat</SelectItem>
              <SelectItem value="review">Felülvizsgálat</SelectItem>
              <SelectItem value="approved">Jóváhagyott</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => {
          setSelectedTemplate(null);
          setIsEditing(true);
          setEditData({});
        }}>
          Új sablon
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {templates.data?.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{template.title}</CardTitle>
                <Badge className={getStatusColor(template.status)}>
                  {template.status}
                </Badge>
              </div>
              <CardDescription>
                {template.documentType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                {template.guidance.substring(0, 150)}...
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Használva: {template.usageCount}x
                </span>
                {template.successRate && (
                  <span>
                    Sikeresség: {Math.round(template.successRate * 100)}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedTemplate || isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(null);
            setIsEditing(false);
            setEditData({});
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? selectedTemplate
                  ? 'Sablon szerkesztése'
                  : 'Új sablon'
                : selectedTemplateData.data?.title}
            </DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label>Cím</Label>
                <Input
                  value={editData.title || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Szakterület</Label>
                <Select
                  value={editData.practiceAreaId}
                  onValueChange={(value) =>
                    setEditData({ ...editData, practiceAreaId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz szakterületet" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.data?.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dokumentum típus</Label>
                <Select
                  value={editData.documentType}
                  onValueChange={(value) =>
                    setEditData({ ...editData, documentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz típust" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Szerződés</SelectItem>
                    <SelectItem value="motion">Beadvány</SelectItem>
                    <SelectItem value="opinion">Jogi vélemény</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Útmutató</Label>
                <Textarea
                  value={editData.guidance || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, guidance: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Sablon tartalma</Label>
                <Textarea
                  className="min-h-[400px] font-mono"
                  value={editData.content || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Státusz</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value: Template['status']) =>
                    setEditData({ ...editData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz státuszt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Vázlat</SelectItem>
                    <SelectItem value="review">Felülvizsgálat</SelectItem>
                    <SelectItem value="approved">Jóváhagyott</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({});
                  }}
                >
                  Mégse
                </Button>
                <Button onClick={handleSave}>Mentés</Button>
              </div>
            </div>
          ) : (
            selectedTemplateData.data && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{selectedTemplateData.data.documentType}</span>
                    <span>•</span>
                    <span>
                      {new Date(
                        selectedTemplateData.data.updatedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge
                    className={getStatusColor(
                      selectedTemplateData.data.status
                    )}
                  >
                    {selectedTemplateData.data.status}
                  </Badge>
                </div>

                <div className="prose max-w-none">
                  <h3>Útmutató</h3>
                  <p>{selectedTemplateData.data.guidance}</p>

                  <h3>Sablon tartalma</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {selectedTemplateData.data.content}
                  </pre>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Copy template to clipboard
                      navigator.clipboard.writeText(
                        selectedTemplateData.data.content
                      );
                    }}
                  >
                    Másolás
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditData(selectedTemplateData.data);
                    }}
                  >
                    Szerkesztés
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 